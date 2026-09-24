import { Request, Response } from "express";
import { Competition, Registration } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * ======================================================================================
 * COMPETITION CONTROLLERS & BUSINESS LOGIC
 * ======================================================================================
 *
 * Implements:
 * 1. GET  /api/competitions/:id            - Single-query composite state endpoint
 * 2. POST /api/competitions/:id/register   - Atomic reservation with rollback compensation
 * 3. POST /api/competitions/:id/submission - Time-gated submission handling
 * ======================================================================================
 */

/**
 * 1. GET /api/competitions/:id
 *
 * Fetches the complete competition record merged with the requesting user's registration
 * and submission state. Serves as the single unified endpoint for the Competition Details screen.
 */
export const getCompetitionDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Fetch competition document
    const competition = await Competition.findById(id);
    if (!competition) {
      throw new AppError(404, "NOT_FOUND", `Competition not found with ID: ${id}`);
    }

    // Determine current user's registration status
    let userRegistration = {
      isRegistered: false,
      status: "not_registered" as "not_registered" | "registered" | "submitted",
      registeredAt: null as Date | null,
      hasSubmitted: false,
      submission: null as unknown,
    };

    if (req.user) {
      const registration = await Registration.findOne({
        competitionId: competition._id,
        userId: req.user._id,
      });

      if (registration) {
        const hasSubmitted = Boolean(
          registration.submission?.submittedAt ||
            registration.submission?.content ||
            registration.submission?.mediaUrl
        );

        userRegistration = {
          isRegistered: true,
          status: hasSubmitted ? "submitted" : "registered",
          registeredAt: registration.registeredAt,
          hasSubmitted,
          submission: registration.submission || null,
        };
      }
    }

    const competitionJson = competition.toJSON();

    res.status(200).json({
      success: true,
      data: {
        ...competitionJson,
        spotsRemaining: competition.spotsRemaining,
        lifecycleState: competition.lifecycleState,
        isRegistrationOpen: competition.isRegistrationOpen,
        isSubmissionOpen: competition.isSubmissionOpen,
        userRegistration,
      },
    });
  }
);

/**
 * 2. POST /api/competitions/:id/register
 *
 * Performs atomic spot reservation and registration creation.
 *
 * CRITICAL CONCURRENCY SAFEGUARD:
 * Uses a single atomic findOneAndUpdate with an $expr condition to prevent overselling
 * race conditions at the MongoDB storage engine level. If an insert fails on the unique
 * compound index (E11000 duplicate registration), an atomic compensating decrement
 * ($inc: { spotsTaken: -1 }) rolls back the reserved spot.
 */
export const registerForCompetition = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "User authentication required to register.");
    }

    // 1. Fast-path check: prevent unnecessary counter operations if already registered
    const existingRegistration = await Registration.findOne({
      competitionId: id,
      userId: user._id,
    });

    if (existingRegistration) {
      throw new AppError(
        409,
        "ALREADY_REGISTERED",
        "You are already registered for this competition."
      );
    }

    // 2. Atomic spot reservation
    // Uses $expr to compare spotsTaken against totalSpots inside a single atomic operation
    const now = new Date();
    const competition = await Competition.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: ["$spotsTaken", "$totalSpots"] },
        registerBy: { $gt: now },
      },
      { $inc: { spotsTaken: 1 } },
      { new: true }
    );

    // 3. If atomic reservation failed, determine root cause
    if (!competition) {
      const checkCompetition = await Competition.findById(id);

      if (!checkCompetition) {
        throw new AppError(404, "NOT_FOUND", `Competition not found with ID: ${id}`);
      }

      if (now >= checkCompetition.registerBy) {
        throw new AppError(
          410,
          "REGISTRATION_CLOSED",
          `Registration deadline passed on ${checkCompetition.registerBy.toISOString()}.`
        );
      }

      if (checkCompetition.spotsTaken >= checkCompetition.totalSpots) {
        throw new AppError(
          409,
          "SPOTS_FULL",
          "Competition has reached maximum capacity. No spots remaining."
        );
      }

      throw new AppError(
        409,
        "REGISTRATION_FAILED",
        "Registration could not be completed. Please try again."
      );
    }

    // 4. Create Registration document
    // If this fails due to a concurrent duplicate insert (E11000), execute compensating rollback
    let registration;
    try {
      registration = await Registration.create({
        competitionId: competition._id,
        userId: user._id,
        registeredAt: new Date(),
        paymentStatus: "paid", // Mocked per assignment scope
      });
    } catch (err: any) {
      // COMPENSATING ROLLBACK: Revert spot reservation to prevent counter drift
      await Competition.updateOne(
        { _id: competition._id },
        { $inc: { spotsTaken: -1 } }
      );

      if (err.code === 11000) {
        throw new AppError(
          409,
          "ALREADY_REGISTERED",
          "You are already registered for this competition."
        );
      }

      throw err;
    }

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        registrationId: registration._id,
        competitionId: competition._id,
        registeredAt: registration.registeredAt,
        paymentStatus: registration.paymentStatus,
        spotsRemaining: competition.spotsRemaining,
        spotsTaken: competition.spotsTaken,
        totalSpots: competition.totalSpots,
        userRegistration: {
          isRegistered: true,
          status: "registered",
          registeredAt: registration.registeredAt,
          hasSubmitted: false,
          submission: null,
        },
      },
    });
  }
);

/**
 * 3. POST /api/competitions/:id/submission
 *
 * Handles submission upload for a registered participant.
 * Gated by active submission window (computed on-the-fly) and registration existence.
 */
export const submitEntry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "User authentication required to submit.");
    }

    // 1. Verify user has an existing registration for this competition
    const registration = await Registration.findOne({
      competitionId: id,
      userId: user._id,
    });

    if (!registration) {
      throw new AppError(
        403,
        "NOT_REGISTERED",
        "You must register for this competition before submitting an entry."
      );
    }

    // 2. Validate current lifecycle state dynamically
    const competition = await Competition.findById(id);
    if (!competition) {
      throw new AppError(404, "NOT_FOUND", `Competition not found with ID: ${id}`);
    }

    const now = new Date();
    if (now < competition.submissionStart) {
      throw new AppError(
        400,
        "SUBMISSION_NOT_OPEN",
        `Submission window has not opened yet. Submissions open on ${competition.submissionStart.toISOString()}.`
      );
    }

    if (now >= competition.submissionEnd) {
      throw new AppError(
        410,
        "SUBMISSION_CLOSED",
        `Submission window has already closed. Submissions ended on ${competition.submissionEnd.toISOString()}.`
      );
    }

    // 3. Payload validation (Text description or media URL reference)
    // ASSUMPTION PER SCOPE.MD: Real file upload (S3/Cloudinary) is out of scope.
    // Accepts simple text and/or link URL field.
    const { content, mediaUrl } = req.body;
    const trimmedContent = typeof content === "string" ? content.trim() : "";
    const trimmedMediaUrl = typeof mediaUrl === "string" ? mediaUrl.trim() : "";

    if (!trimmedContent && !trimmedMediaUrl) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Submission must include at least 'content' or 'mediaUrl'."
      );
    }

    // 4. Update registration with submission details
    registration.submission = {
      submittedAt: new Date(),
      content: trimmedContent || undefined,
      mediaUrl: trimmedMediaUrl || undefined,
    };

    await registration.save();

    res.status(200).json({
      success: true,
      message: "Submission uploaded successfully",
      data: {
        registrationId: registration._id,
        competitionId: competition._id,
        submission: registration.submission,
        userRegistration: {
          isRegistered: true,
          status: "submitted",
          registeredAt: registration.registeredAt,
          hasSubmitted: true,
          submission: registration.submission,
        },
      },
    });
  }
);

/**
 * 4. GET /api/competitions/latest
 *
 * Fetches the single most recently created Competition document merged with the requesting
 * user's registration and submission state. Returns the exact same response shape as
 * GET /api/competitions/:id.
 */
export const getLatestCompetition = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Sort by _id descending to return the single most recently created Competition document
    const competition = await Competition.findOne().sort({ createdAt: -1, _id: -1 });
    if (!competition) {
      throw new AppError(
        404,
        "NOT_FOUND",
        "No competitions found — run npm run seed first"
      );
    }

    // Determine current user's registration status
    let userRegistration = {
      isRegistered: false,
      status: "not_registered" as "not_registered" | "registered" | "submitted",
      registeredAt: null as Date | null,
      hasSubmitted: false,
      submission: null as unknown,
    };

    if (req.user) {
      const registration = await Registration.findOne({
        competitionId: competition._id,
        userId: req.user._id,
      });

      if (registration) {
        const hasSubmitted = Boolean(
          registration.submission?.submittedAt ||
            registration.submission?.content ||
            registration.submission?.mediaUrl
        );

        userRegistration = {
          isRegistered: true,
          status: hasSubmitted ? "submitted" : "registered",
          registeredAt: registration.registeredAt,
          hasSubmitted,
          submission: registration.submission || null,
        };
      }
    }

    const competitionJson = competition.toJSON();

    res.status(200).json({
      success: true,
      data: {
        ...competitionJson,
        spotsRemaining: competition.spotsRemaining,
        lifecycleState: competition.lifecycleState,
        isRegistrationOpen: competition.isRegistrationOpen,
        isSubmissionOpen: competition.isSubmissionOpen,
        userRegistration,
      },
    });
  }
);

