import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import app from "../index";
import { connectDB } from "../config/db";
import { Competition, Registration, User } from "../models";

/**
 * ======================================================================================
 * CONCURRENCY REGISTRATION RACE CONDITION TEST
 * ======================================================================================
 *
 * Simulates high-concurrency race condition:
 * - Exactly ONE spot remains in the competition (spotsTaken = totalSpots - 1).
 * - N simultaneous HTTP POST /api/competitions/:id/register requests are fired
 *   concurrently via Promise.all using distinct mock user tokens.
 * - Asserts:
 *   1. Exactly ONE request receives HTTP 201 Created.
 *   2. Exactly (N - 1) requests receive HTTP 409 Conflict with code 'SPOTS_FULL'.
 *   3. Zero unhandled exceptions or 500 Internal Server Errors occur.
 *   4. Final database spotsTaken does not exceed totalSpots (Zero overselling invariant).
 *   5. Final database registrations count incremented by exactly 1.
 * ======================================================================================
 */

const NUM_CONCURRENT_REQUESTS = 15;
const TEST_PORT = 5055;
const TEST_USER_PREFIX = "concurrency-tester-";

interface TestResponseResult {
  index: number;
  token: string;
  status: number;
  data: any;
  durationMs: number;
}

const runConcurrencyTest = async () => {
  console.log("====================================================================");
  console.log("🧪 FEEDANTS API CONCURRENCY & RACE-CONDITION TEST SUITE");
  console.log("====================================================================");

  let server: http.Server | null = null;
  let baseUrl = `http://127.0.0.1:${TEST_PORT}`;

  try {
    // 1. Ensure DB connection
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      await new Promise<void>((resolve) => {
        if (mongoose.connection.readyState === 1) return resolve();
        mongoose.connection.once("connected", () => resolve());
      });
    }

    // 2. Start a dedicated test server instance if port is not running
    server = await new Promise<http.Server | null>((resolve, reject) => {
      const s = app.listen(TEST_PORT, "127.0.0.1", () => {
        console.log(`📡 Test server actively listening on ${baseUrl}`);
        resolve(s);
      });
      s.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log(`ℹ️ Port ${TEST_PORT} already in use, using existing listener on port 5000`);
          baseUrl = "http://127.0.0.1:5000";
          resolve(null as any);
        } else {
          reject(err);
        }
      });
    });

    // 3. Find or ensure seed competition
    let competition = await Competition.findOne({ slug: "feedants-classical-dance" });
    if (!competition) {
      console.log("⚠️ Seed competition not found. Please run 'npm run seed' first.");
      process.exit(1);
    }

    const competitionId = competition._id.toString();
    const totalSpots = competition.totalSpots;

    console.log(`\n📋 Target Competition: "${competition.title}"`);
    console.log(`   - Competition ID:  ${competitionId}`);
    console.log(`   - Total Capacity:  ${totalSpots} spots`);

    // 4. Create N distinct mock users for the concurrent requests
    console.log(`\n👥 Setting up ${NUM_CONCURRENT_REQUESTS} distinct mock users for race condition...`);
    const mockUsers = [];
    for (let i = 0; i < NUM_CONCURRENT_REQUESTS; i++) {
      const token = `${TEST_USER_PREFIX}${Date.now()}-${i}`;
      mockUsers.push({
        name: `Concurrent Tester #${i + 1}`,
        email: `tester_${i}@concurrency.test`,
        mockAuthToken: token,
      });
    }

    const createdUsers = await User.insertMany(mockUsers);
    const userTokens = createdUsers.map((u) => u.mockAuthToken);
    const userIds = createdUsers.map((u) => u._id);

    // 5. CRITICAL SETUP: Set spotsTaken to (totalSpots - 1), so EXACTLY ONE spot is available
    // Also ensure registration deadline is in the future
    await Competition.updateOne(
      { _id: competition._id },
      {
        $set: {
          spotsTaken: totalSpots - 1,
          registerBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
      }
    );

    // Reload document to confirm baseline
    competition = await Competition.findById(competitionId);
    if (!competition) throw new Error("Competition document lost.");

    console.log(`🔥 RACE PRE-CONDITION:`);
    console.log(`   - Spots Taken:     ${competition.spotsTaken}/${totalSpots}`);
    console.log(`   - Spots Remaining: ${competition.spotsRemaining} (EXACTLY 1 SPOT LEFT)`);
    console.log(`   - Register By:     ${competition.registerBy.toISOString()} (OPEN)`);

    // Count registrations before firing
    const initialRegCount = await Registration.countDocuments({
      competitionId: competition._id,
      userId: { $in: userIds },
    });

    console.log(`\n🚀 FIRING ${NUM_CONCURRENT_REQUESTS} SIMULTANEOUS HTTP REGISTRATION REQUESTS...`);
    const startTime = Date.now();

    // 6. Fire N concurrent HTTP requests using Promise.all
    const requestPromises = userTokens.map(async (token, index) => {
      const reqStart = Date.now();
      try {
        const response = await fetch(`${baseUrl}/api/competitions/${competitionId}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        const durationMs = Date.now() - reqStart;
        const data = await response.json();
        return {
          index: index + 1,
          token,
          status: response.status,
          data,
          durationMs,
        } as TestResponseResult;
      } catch (err: any) {
        return {
          index: index + 1,
          token,
          status: 0,
          data: { error: { code: "NETWORK_ERROR", message: err.message } },
          durationMs: Date.now() - reqStart,
        } as TestResponseResult;
      }
    });

    const results = await Promise.all(requestPromises);
    const totalDuration = Date.now() - startTime;

    console.log(`⏱️ All ${NUM_CONCURRENT_REQUESTS} requests completed in ${totalDuration}ms.`);

    // 7. Analyze results
    const successfulResponses = results.filter((r) => r.status === 201);
    const spotsFullResponses = results.filter(
      (r) => r.status === 409 && r.data?.error?.code === "SPOTS_FULL"
    );
    const unexpectedResponses = results.filter(
      (r) => r.status !== 201 && !(r.status === 409 && r.data?.error?.code === "SPOTS_FULL")
    );

    console.log("\n--------------------------------------------------------------------");
    console.log("📊 HTTP RESPONSE BREAKDOWN:");
    console.log("--------------------------------------------------------------------");
    results.forEach((r) => {
      const outcome =
        r.status === 201
          ? "✅ SUCCESS (201 Created)"
          : r.status === 409 && r.data?.error?.code === "SPOTS_FULL"
          ? "⛔ BLOCKED (409 SPOTS_FULL)"
          : `⚠️ UNEXPECTED (${r.status} ${r.data?.error?.code || ""})`;
      const userDisplay = r.token.split("-").slice(-2).join("-");
      console.log(
        `   Req #${String(r.index).padStart(2, " ")} | User: ${userDisplay} | ${outcome} in ${r.durationMs}ms`
      );
    });

    // 8. Inspect post-test Database State
    const finalComp = await Competition.findById(competitionId);
    const finalRegCount = await Registration.countDocuments({
      competitionId: competition._id,
      userId: { $in: userIds },
    });

    console.log("\n--------------------------------------------------------------------");
    console.log("🔍 DATABASE INTEGRITY VERIFICATION:");
    console.log("--------------------------------------------------------------------");
    console.log(`   - Final spotsTaken:           ${finalComp?.spotsTaken}/${totalSpots}`);
    console.log(`   - Final spotsRemaining:       ${finalComp?.spotsRemaining}`);
    console.log(`   - New registrations in DB:    ${finalRegCount - initialRegCount}`);
    console.log(`   - Successful HTTP requests:   ${successfulResponses.length}`);
    console.log(`   - Rejected (SPOTS_FULL):      ${spotsFullResponses.length}`);
    console.log(`   - Unexpected responses:       ${unexpectedResponses.length}`);

    // 9. Automated Assertions
    const assertion1_oneSuccess = successfulResponses.length === 1;
    const assertion2_restSpotsFull = spotsFullResponses.length === NUM_CONCURRENT_REQUESTS - 1;
    const assertion3_zeroErrors = unexpectedResponses.length === 0;
    const assertion4_dbExactCapacity = finalComp?.spotsTaken === totalSpots;
    const assertion5_dbOneRegistration = finalRegCount - initialRegCount === 1;

    console.log("\n--------------------------------------------------------------------");
    console.log("📋 FORMAL ASSERTIONS CHECKLIST:");
    console.log("--------------------------------------------------------------------");
    console.log(`   [${assertion1_oneSuccess ? "PASS" : "FAIL"}] 1. Exactly 1 request received HTTP 201 Created`);
    console.log(
      `   [${assertion2_restSpotsFull ? "PASS" : "FAIL"}] 2. Exactly ${NUM_CONCURRENT_REQUESTS - 1} requests received 409 SPOTS_FULL`
    );
    console.log(`   [${assertion3_zeroErrors ? "PASS" : "FAIL"}] 3. Zero unexpected errors / 500s`);
    console.log(`   [${assertion4_dbExactCapacity ? "PASS" : "FAIL"}] 4. Database spotsTaken equals totalSpots (${totalSpots}/${totalSpots})`);
    console.log(`   [${assertion5_dbOneRegistration ? "PASS" : "FAIL"}] 5. Exactly 1 new Registration document persisted`);

    const allPassed =
      assertion1_oneSuccess &&
      assertion2_restSpotsFull &&
      assertion3_zeroErrors &&
      assertion4_dbExactCapacity &&
      assertion5_dbOneRegistration;

    console.log("====================================================================");
    if (allPassed) {
      console.log("🎉 CONCURRENCY TEST RESULT: ALL ASSERTIONS PASSED ✅");
      console.log("   Zero overselling verified under simultaneous atomic contention.");
    } else {
      console.error("❌ CONCURRENCY TEST RESULT: FAILED ❌");
      process.exitCode = 1;
    }
    console.log("====================================================================");

    // 10. Clean up test users and test registrations
    console.log("\n🧹 Cleaning up test users and test registrations...");
    await Registration.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ _id: { $in: userIds } });

    // Restore competition spotsTaken to 1 (clean seed state)
    await Competition.updateOne(
      { _id: competition._id },
      { $set: { spotsTaken: 1 } }
    );
    console.log("✅ State restored to initial seed configuration.");
  } catch (err) {
    console.error("💥 Unhandled failure in concurrency test runner:", err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      console.log("🔌 Test HTTP server closed.");
    }
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
};

// Execute if run directly
if (require.main === module) {
  runConcurrencyTest();
}
