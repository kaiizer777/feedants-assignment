import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Competition, Registration, User } from "../models";

// Load environment variables before executing database operations
dotenv.config();

const SEED_COMPETITION_SLUG = "feedants-classical-dance";
const SEEDED_USER_TOKEN = "mock-user-seed-registered-1";
const DEMO_USER_TOKEN = "mock-user-demo-unregistered-2";

export const seedDatabase = async (disconnectOnComplete: boolean = true): Promise<void> => {
  try {
    console.log("🌱 Starting database seed script...");

    // 1. Establish database connection using Phase 0 config
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Failed to connect to MongoDB instance.");
    }

    // 2. IDEMPOTENCY ENFORCEMENT:
    // Remove any existing documents with known seed identifiers to guarantee clean re-runs
    console.log("🧹 Cleaning up any previous seed data (ensuring idempotency)...");

    const existingComp = await Competition.findOne({ slug: SEED_COMPETITION_SLUG });
    if (existingComp) {
      await Registration.deleteMany({ competitionId: existingComp._id });
      await Competition.deleteOne({ _id: existingComp._id });
      console.log(`   - Deleted existing competition [${SEED_COMPETITION_SLUG}] and its registrations`);
    }

    await User.deleteMany({
      mockAuthToken: { $in: [SEEDED_USER_TOKEN, DEMO_USER_TOKEN] },
    });
    console.log("   - Cleaned up seed test users");

    // 3. Seed Users
    // User 1: Already registered (accounts for spotsTaken: 1)
    const registeredUser = await User.create({
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      mockAuthToken: SEEDED_USER_TOKEN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    });

    // User 2: Unregistered user for interactive testing in Phase 2 & 4
    const demoUser = await User.create({
      name: "Saif (Solo Dev)",
      email: "saif@example.com",
      mockAuthToken: DEMO_USER_TOKEN,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    });

    console.log(`✅ Seeded 2 users: Registered (${registeredUser.name}) & Demo Unregistered (${demoUser.name})`);

    // 4. Seed Competition matching design data with dynamic dates relative to current time
    // This allows active registration (spots open, deadline in future) and active submission
    // for seamless interactive testing and screen recordings:
    // - Submission Starts: 2 days ago (active submission window)
    // - Register Before:   5 days from now (active registration countdown)
    // - Submission Ends:   15 days from now
    // - Result Date:       18 days from now
    const now = Date.now();
    const submissionStart = new Date(now - 2 * 24 * 60 * 60 * 1000);
    const registerBy = new Date(now + 5 * 24 * 60 * 60 * 1000);
    const submissionEnd = new Date(now + 15 * 24 * 60 * 60 * 1000);
    const resultDate = new Date(now + 18 * 24 * 60 * 60 * 1000);

    const competition = await Competition.create({
      title: "Feedants Classical Dance",
      slug: SEED_COMPETITION_SLUG,
      category: "Dance",
      tags: ["Dance", "Multi-Win", "Winners get certificate"],
      description:
        "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.",
      prizePool: 1500,
      entryFee: 99,
      totalSpots: 20,
      spotsTaken: 1, // Matches "1 / 20 Booked" and "Only 19 spots left" in design
      registerBy,
      submissionStart,
      submissionEnd,
      resultDate,
      rewards: [
        { rank: 1, amount: 550, title: "1st Winner" },
        { rank: 2, amount: 300, title: "2nd Winner" },
        { rank: 3, amount: 240, title: "3rd Winner" },
        { rank: 4, amount: 200, title: "4th Winner" },
        { rank: 5, amount: 130, title: "5th Winner" },
        { rank: 6, amount: 80, title: "6th Winner" },
      ],
      judge: {
        name: "Manju Dubey",
        title: "Professional Kathak Dancer",
        bio: "12+ Years of Experience",
        introVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
      },
      rulesAndEligibility: [
        "Open to all age groups across India.",
        "Performances must strictly belong to recognized classical dance styles (Kathak, Bharatanatyam, Odissi, Kuchipudi, Kathakali, Mohiniyattam, Manipuri, or Sattriya).",
        "Video duration must be between 2 to 5 minutes.",
        "Single-take unedited video recordings are preferred for genuine judging.",
        "Only contributions from paid participants will be considered for judging.",
        "Decisions of the judge (Manju Dubey) are final and binding.",
      ],
      judgingParameters: [
        "Bhava & Abhinaya (Facial Expressions & Storytelling) - 30%",
        "Taal & Laya (Rhythm & Timing) - 25%",
        "Angashuddhi (Posture & Body Alignment) - 25%",
        "Costume, Presentation & Overall Impact - 20%",
      ],
      previousWinners: [
        {
          name: "Riya Shah",
          rank: "1st Winner",
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
          name: "Aarav Mehta",
          rank: "1st Winner",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        },
        {
          name: "Neha Verma",
          rank: "2nd Winner",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        },
        {
          name: "Ishita Chopra",
          rank: "3rd Winner",
          imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        },
      ],
      bannerUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
      certificateProvided: true,
    });

    console.log(`✅ Seeded competition: "${competition.title}" (ID: ${competition._id})`);

    // 5. Seed 1 Registration for Ananya Sharma to match spotsTaken = 1
    const registration = await Registration.create({
      competitionId: competition._id,
      userId: registeredUser._id,
      registeredAt: new Date(now - 24 * 60 * 60 * 1000),
      paymentStatus: "paid",
      submission: {
        submittedAt: new Date(now - 12 * 60 * 60 * 1000),
        content: "Kathak Teentaal Thaat and Tukdas performance submitted.",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      },
    });

    console.log(`✅ Seeded initial registration for ${registeredUser.name} (Reg ID: ${registration._id})`);

    // 6. Verify seed data integrity
    const totalCompetitions = await Competition.countDocuments({ slug: SEED_COMPETITION_SLUG });
    const totalRegistrations = await Registration.countDocuments({ competitionId: competition._id });

    console.log("--------------------------------------------------");
    console.log("📊 SEED INTEGRITY VERIFICATION:");
    console.log(`   - Competitions matching slug: ${totalCompetitions}`);
    console.log(`   - Spots taken recorded:       ${competition.spotsTaken}/${competition.totalSpots}`);
    console.log(`   - Spots remaining (virtual):  ${competition.spotsRemaining}`);
    console.log(`   - Registrations in DB:        ${totalRegistrations}`);
    console.log(`   - Computed Lifecycle State:   ${competition.lifecycleState}`);
    console.log("--------------------------------------------------");

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    if (disconnectOnComplete) {
      await mongoose.disconnect();
      console.log("🔌 MongoDB disconnected.");
    }
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase();
}
