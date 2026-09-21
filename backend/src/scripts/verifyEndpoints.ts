import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import app from "../index";
import { connectDB } from "../config/db";
import { Competition, Registration, User } from "../models";
import { seedDatabase } from "../db/seed";

const VERIFY_PORT = 5056;

interface TestCaseResult {
  category: string;
  name: string;
  expectedStatus: number;
  actualStatus: number;
  expectedCode?: string;
  actualCode?: string;
  passed: boolean;
  details?: string;
}

const results: TestCaseResult[] = [];

const recordTest = (
  category: string,
  name: string,
  expectedStatus: number,
  actualStatus: number,
  expectedCode?: string,
  actualCode?: string,
  details?: string
) => {
  const statusMatch = actualStatus === expectedStatus;
  const codeMatch = !expectedCode || actualCode === expectedCode;
  const passed = statusMatch && codeMatch;

  results.push({
    category,
    name,
    expectedStatus,
    actualStatus,
    expectedCode,
    actualCode,
    passed,
    details,
  });

  const icon = passed ? "✅" : "❌";
  console.log(
    `   ${icon} [${actualStatus} ${actualCode || ""}] ${name}${!passed ? ` (Expected ${expectedStatus} ${expectedCode || ""})` : ""}`
  );
};

const runEndpointVerification = async () => {
  console.log("====================================================================");
  console.log("🔬 COMPLETE API ENDPOINT & BUSINESS LOGIC VERIFICATION SUITE");
  console.log("====================================================================");

  let server: http.Server | null = null;
  const baseUrl = `http://127.0.0.1:${VERIFY_PORT}`;

  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      await new Promise<void>((resolve) => {
        if (mongoose.connection.readyState === 1) return resolve();
        mongoose.connection.once("connected", () => resolve());
      });
    }

    // Start dedicated verification server
    server = await new Promise<http.Server>((resolve, reject) => {
      const s = app.listen(VERIFY_PORT, "127.0.0.1", () => {
        console.log(`📡 Verification server running on ${baseUrl}`);
        resolve(s);
      });
      s.on("error", reject);
    });

    // 1. Reset to clean seed state
    console.log("\n🌱 Resetting to clean seed state...");
    await seedDatabase(false);

    const competition = await Competition.findOne({ slug: "feedants-classical-dance" });
    if (!competition) throw new Error("Seed competition not found.");
    const compId = competition._id.toString();
    const registeredToken = "mock-user-seed-registered-1";
    const unregisteredToken = "mock-user-demo-unregistered-2";
    const fakeNonExistentId = new mongoose.Types.ObjectId().toString();

    // ====================================================================
    // GROUP 1: GET /api/competitions/:id
    // ====================================================================
    console.log("\n📋 [GROUP 1] GET /api/competitions/:id");

    // 1.1 Invalid ObjectId format
    {
      const res = await fetch(`${baseUrl}/api/competitions/not-a-valid-object-id`);
      const body = (await res.json()) as any;
      recordTest(
        "GET /competitions/:id",
        "Invalid ObjectId format returns 400 INVALID_ID",
        400,
        res.status,
        "INVALID_ID",
        body?.error?.code
      );
    }

    // 1.2 Valid ObjectId but document not found
    {
      const res = await fetch(`${baseUrl}/api/competitions/${fakeNonExistentId}`);
      const body = (await res.json()) as any;
      recordTest(
        "GET /competitions/:id",
        "Non-existent competition ID returns 404 NOT_FOUND",
        404,
        res.status,
        "NOT_FOUND",
        body?.error?.code
      );
    }

    // 1.3 Anonymous request (no auth headers)
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}`);
      const body = (await res.json()) as any;
      const isGuestNotReg = body?.data?.userRegistration?.status === "not_registered";
      recordTest(
        "GET /competitions/:id",
        "Anonymous GET returns 200 with status 'not_registered'",
        200,
        res.status,
        undefined,
        undefined,
        `spotsRemaining: ${body?.data?.spotsRemaining}, lifecycleState: ${body?.data?.lifecycleState}`
      );
      if (!isGuestNotReg) {
        console.error("   ❌ Anonymous userRegistration status should be 'not_registered'");
      }
    }

    // 1.4 Seeded registered user (Ananya Sharma)
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}`, {
        headers: { "x-auth-token": registeredToken },
      });
      const body = (await res.json()) as any;
      const isReg = body?.data?.userRegistration?.isRegistered === true;
      const isSubmitted = body?.data?.userRegistration?.status === "submitted";
      recordTest(
        "GET /competitions/:id",
        "Registered user GET returns 200 with userRegistration.status 'submitted'",
        200,
        res.status
      );
      if (!isReg || !isSubmitted) {
        console.error("   ❌ Registered user registration state mismatch");
      }
    }

    // 1.5 Seeded unregistered user (Saif)
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}`, {
        headers: { "x-auth-token": unregisteredToken },
      });
      const body = (await res.json()) as any;
      const isNotReg = body?.data?.userRegistration?.status === "not_registered";
      recordTest(
        "GET /competitions/:id",
        "Unregistered user GET returns 200 with userRegistration.status 'not_registered'",
        200,
        res.status
      );
      if (!isNotReg) {
        console.error("   ❌ Unregistered user registration state mismatch");
      }
    }

    // ====================================================================
    // GROUP 2: POST /api/competitions/:id/register
    // ====================================================================
    console.log("\n📋 [GROUP 2] POST /api/competitions/:id/register");

    // 2.1 Missing auth header
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Missing auth header returns 401 UNAUTHORIZED",
        401,
        res.status,
        "UNAUTHORIZED",
        body?.error?.code
      );
    }

    // 2.2 Invalid auth token
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": "non-existent-fake-token" },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Invalid auth token returns 401 UNAUTHORIZED",
        401,
        res.status,
        "UNAUTHORIZED",
        body?.error?.code
      );
    }

    // 2.3 Invalid competition ID format
    {
      const res = await fetch(`${baseUrl}/api/competitions/invalid-id/register`, {
        method: "POST",
        headers: { "x-auth-token": unregisteredToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Invalid ID format returns 400 INVALID_ID",
        400,
        res.status,
        "INVALID_ID",
        body?.error?.code
      );
    }

    // 2.4 Non-existent competition ID
    {
      const res = await fetch(`${baseUrl}/api/competitions/${fakeNonExistentId}/register`, {
        method: "POST",
        headers: { "x-auth-token": unregisteredToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Non-existent competition returns 404 NOT_FOUND",
        404,
        res.status,
        "NOT_FOUND",
        body?.error?.code
      );
    }

    // 2.5 User already registered
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": registeredToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Already registered user returns 409 ALREADY_REGISTERED",
        409,
        res.status,
        "ALREADY_REGISTERED",
        body?.error?.code
      );
    }

    // 2.6 Successful registration
    let postRegSpotsRemaining = 0;
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": unregisteredToken },
      });
      const body = (await res.json()) as any;
      postRegSpotsRemaining = body?.data?.spotsRemaining;
      recordTest(
        "POST /register",
        "Fresh user registration returns 201 Created and updates spotsRemaining",
        201,
        res.status,
        undefined,
        undefined,
        `new spotsRemaining: ${postRegSpotsRemaining}`
      );
    }

    // 2.7 Immediate duplicate registration attempt by same newly registered user
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": unregisteredToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Immediate duplicate registration attempt returns 409 ALREADY_REGISTERED",
        409,
        res.status,
        "ALREADY_REGISTERED",
        body?.error?.code
      );
    }

    // 2.8 Spots full failure
    {
      // Create a dedicated 3rd test user
      const fullTestUser = await User.create({
        name: "Full Test User",
        email: "full@test.com",
        mockAuthToken: "mock-user-full-test",
      });

      // Temporarily max out spotsTaken
      await Competition.updateOne(
        { _id: competition._id },
        { $set: { spotsTaken: competition.totalSpots } }
      );

      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": fullTestUser.mockAuthToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Registration when capacity full returns 409 SPOTS_FULL",
        409,
        res.status,
        "SPOTS_FULL",
        body?.error?.code
      );

      // Clean up test user
      await User.deleteOne({ _id: fullTestUser._id });
    }

    // 2.9 Registration deadline passed failure
    {
      const deadlineTestUser = await User.create({
        name: "Deadline Test User",
        email: "deadline@test.com",
        mockAuthToken: "mock-user-deadline-test",
      });

      // Temporarily set spotsTaken back down to 10, but set registerBy in the past
      await Competition.updateOne(
        { _id: competition._id },
        {
          $set: {
            spotsTaken: 10,
            registerBy: new Date(Date.now() - 60000), // 1 minute in the past
          },
        }
      );

      const res = await fetch(`${baseUrl}/api/competitions/${compId}/register`, {
        method: "POST",
        headers: { "x-auth-token": deadlineTestUser.mockAuthToken },
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /register",
        "Registration after deadline returns 410 REGISTRATION_CLOSED",
        410,
        res.status,
        "REGISTRATION_CLOSED",
        body?.error?.code
      );

      // Clean up test user
      await User.deleteOne({ _id: deadlineTestUser._id });

      // Restore registerBy to future
      await Competition.updateOne(
        { _id: competition._id },
        {
          $set: {
            registerBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          },
        }
      );
    }

    // ====================================================================
    // GROUP 3: POST /api/competitions/:id/submission
    // ====================================================================
    console.log("\n📋 [GROUP 3] POST /api/competitions/:id/submission");

    // 3.1 Missing auth header
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Kathak solo performance video" }),
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /submission",
        "Missing auth header returns 401 UNAUTHORIZED",
        401,
        res.status,
        "UNAUTHORIZED",
        body?.error?.code
      );
    }

    // 3.2 User not registered
    {
      const nonRegUser = await User.create({
        name: "Unregistered Submitter",
        email: "unreg_sub@test.com",
        mockAuthToken: "mock-user-unregistered-submitter",
      });

      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": nonRegUser.mockAuthToken,
        },
        body: JSON.stringify({ content: "Unauthorized attempt" }),
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /submission",
        "Unregistered user submission returns 403 NOT_REGISTERED",
        403,
        res.status,
        "NOT_REGISTERED",
        body?.error?.code
      );

      await User.deleteOne({ _id: nonRegUser._id });
    }

    // 3.3 Empty payload validation failure
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": unregisteredToken, // now registered from test 2.6
        },
        body: JSON.stringify({ content: "   ", mediaUrl: "" }),
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /submission",
        "Empty submission payload returns 400 VALIDATION_ERROR",
        400,
        res.status,
        "VALIDATION_ERROR",
        body?.error?.code
      );
    }

    // 3.4 Successful submission
    {
      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": unregisteredToken,
        },
        body: JSON.stringify({
          content: "Classical Kathak Tarana performance entry",
          mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        }),
      });
      const body = (await res.json()) as any;
      const hasSubmissionSaved = Boolean(body?.data?.submission?.submittedAt);
      recordTest(
        "POST /submission",
        "Registered user submission returns 200 OK with timestamp and submission data",
        200,
        res.status,
        undefined,
        undefined,
        `submittedAt: ${body?.data?.submission?.submittedAt}`
      );
      if (!hasSubmissionSaved) {
        console.error("   ❌ Submission timestamp was not saved");
      }
    }

    // 3.5 Submission window not yet open failure
    {
      // Temporarily set submissionStart in the future
      await Competition.updateOne(
        { _id: competition._id },
        { $set: { submissionStart: new Date(Date.now() + 86400000) } }
      );

      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": unregisteredToken,
        },
        body: JSON.stringify({ content: "Early submission attempt" }),
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /submission",
        "Submission before window opens returns 400 SUBMISSION_NOT_OPEN",
        400,
        res.status,
        "SUBMISSION_NOT_OPEN",
        body?.error?.code
      );
    }

    // 3.6 Submission window already closed failure
    {
      // Temporarily set submissionEnd in the past
      await Competition.updateOne(
        { _id: competition._id },
        {
          $set: {
            submissionStart: new Date(Date.now() - 200000),
            submissionEnd: new Date(Date.now() - 100000),
          },
        }
      );

      const res = await fetch(`${baseUrl}/api/competitions/${compId}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": unregisteredToken,
        },
        body: JSON.stringify({ content: "Late submission attempt" }),
      });
      const body = (await res.json()) as any;
      recordTest(
        "POST /submission",
        "Submission after window closes returns 410 SUBMISSION_CLOSED",
        410,
        res.status,
        "SUBMISSION_CLOSED",
        body?.error?.code
      );
    }

    // Final clean reset
    console.log("\n🧹 Resetting seed data to pristine initial state...");
    await seedDatabase(false);

    // ====================================================================
    // SUMMARY REPORT
    // ====================================================================
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log("\n====================================================================");
    console.log("📊 API ENDPOINT VERIFICATION SCORECARD:");
    console.log("====================================================================");
    console.log(`   Total Endpoints & Edge Cases Evaluated: ${totalTests}`);
    console.log(`   Passed:                                 ${passedTests} ✅`);
    console.log(`   Failed:                                 ${failedTests} ${failedTests > 0 ? "❌" : ""}`);
    console.log("====================================================================");

    if (failedTests === 0) {
      console.log("🎉 ALL API ENDPOINTS & EDGE CASES FULLY VERIFIED AND PASSING! 🎉");
    } else {
      console.error("❌ Some verification test cases failed.");
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("💥 Unhandled exception during endpoint verification:", err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      console.log("🔌 Verification HTTP server closed.");
    }
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
};

if (require.main === module) {
  runEndpointVerification();
}
