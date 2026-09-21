/**
 * ======================================================================================
 * REGISTRATION MODEL SPECIFICATION & CONCURRENCY SAFEGUARDS
 * ======================================================================================
 *
 * CRITICAL ARCHITECTURAL CONCERN: DATABASE-LEVEL UNIQUE COMPOUND INDEX
 * --------------------------------------------------------------------------------------
 * Schema Index: RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
 *
 * Why this compound index is MANDATORY for business logic correctness (not just performance):
 *
 * In web and mobile applications, network retry loops, rapid double-clicks on the "Register"
 * button, or concurrent requests from multiple browser tabs/devices create Time-Of-Check to
 * Time-Of-Use (TOCTOU) race conditions.
 *
 * If the application relied solely on runtime code validation:
 *   const existing = await Registration.findOne({ competitionId, userId });
 *   if (!existing) {
 *     await Registration.create({ competitionId, userId, ... });
 *   }
 *
 * Under concurrent execution:
 *   1. Request 1 executes `findOne` -> returns `null` (not registered).
 *   2. Request 2 executes `findOne` in parallel -> also returns `null`.
 *   3. Request 1 inserts a new registration document and decrements a spot.
 *   4. Request 2 inserts another registration document and decrements a second spot.
 *
 * Consequence: The user is registered twice, charged twice, and two competition spots are
 * consumed for one person, causing data corruption and spot count drift.
 *
 * By declaring a UNIQUE compound index on `(competitionId, userId)` at the database level:
 * MongoDB's WiredTiger storage engine enforces a strict unique constraint directly on the B-tree.
 * Even if two concurrent requests race past application validation simultaneously, exactly ONE
 * insert will commit, and the second insert will be rejected atomically with a MongoDB
 * `E11000 duplicate key error`. The application can catch this error and gracefully return a
 * 409 Conflict without corrupting state.
 * ======================================================================================
 */

import { Schema, model, Document, Types } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface ISubmission {
  submittedAt?: Date;
  content?: string; // Text description, performance notes, or file link
  mediaUrl?: string; // S3 / Cloudinary URL for video or audio submission
}

export interface IRegistration {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  registeredAt: Date;
  paymentStatus: PaymentStatus;
  submission?: ISubmission;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationDocument extends IRegistration, Document {}

const SubmissionSchema = new Schema<ISubmission>(
  {
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [2000, "Submission content cannot exceed 2000 characters"],
    },
    mediaUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    competitionId: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition reference is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed"],
        message: "Invalid payment status: {VALUE}",
      },
      default: "paid", // Mocked per assignment scope (real gateway out of scope)
      required: true,
      index: true,
    },
    submission: {
      type: SubmissionSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as { __v?: number }).__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as { __v?: number }).__v;
        return ret;
      },
    },
  }
);

// CRITICAL UNIQUE COMPOUND INDEX: Prevents duplicate registrations at DB engine level
RegistrationSchema.index(
  { competitionId: 1, userId: 1 },
  {
    unique: true,
    name: "uniq_competition_user_registration",
  }
);

// Compound index for querying user registrations ordered by registration date
RegistrationSchema.index({ userId: 1, registeredAt: -1 });

export const Registration = model<IRegistrationDocument>(
  "Registration",
  RegistrationSchema
);
