/**
 * ======================================================================================
 * ARCHITECTURAL DECISIONS & SCHEMA SPECIFICATION
 * ======================================================================================
 *
 * 1. DECISION: STORED COUNTER vs. DERIVED COUNT FOR "SPOTS REMAINING"
 * --------------------------------------------------------------------------------------
 * Decision: STORED COUNTER (`spotsTaken` on the Competition document).
 *
 * Technical Justification & Trade-off Analysis:
 *
 * a) Read Performance at Scale:
 *    In high-traffic consumer platforms (thousands of concurrent users opening the competition
 *    details screen or watching live countdowns), reads vastly outnumber writes (approx 100:1 ratio).
 *    Deriving spots remaining dynamically via `Registration.countDocuments({ competitionId, paymentStatus: 'paid' })`
 *    requires a secondary collection index scan or B-tree traversal on every single GET request.
 *    At scale, this saturates MongoDB read IOPS and increases p95/p99 response latency.
 *    With a stored `spotsTaken` counter, reading `spotsRemaining` is an O(1) in-memory computation
 *    (`totalSpots - spotsTaken`) returned directly in the initial document query without secondary lookups.
 *
 * b) Concurrency & Atomic Reservation Strategy (Phase 2 Alignment):
 *    Preventing overselling the final spot (e.g. 50 users clicking "Register Now" simultaneously
 *    for 1 remaining spot) is a critical business invariant.
 *    A derived count cannot be atomically incremented or conditionally checked in a single document
 *    operation without distributed multi-document ACID transactions, which introduce lock contention
 *    and latency overhead.
 *    Conversely, a stored counter enables a single-document atomic update via MongoDB's findOneAndUpdate:
 *      Competition.findOneAndUpdate(
 *        { _id: competitionId, spotsTaken: { $lt: totalSpots }, registerBy: { $gt: new Date() } },
 *        { $inc: { spotsTaken: 1 } },
 *        { new: true }
 *      )
 *    This lock-free, single-document atomic check-and-increment executes at the WiredTiger storage engine
 *    layer, guaranteeing zero overselling race conditions under arbitrary concurrency.
 *
 * c) Drift Risk & Mitigation:
 *    The acknowledged trade-off of a stored counter is potential drift if an application crash occurs
 *    between spot increment and registration document creation, or during refund/cancellation flows.
 *    Mitigation:
 *    - In application logic, wrap the reservation and registration in a MongoDB session transaction,
 *      or implement an atomic compensation decrement ($inc: { spotsTaken: -1 }) on failure.
 *    - In production, schedule a lightweight background reconciliation cron (or CDC pipeline)
 *      to periodically verify `spotsTaken === countDocuments(Registration)` and reconcile any anomalies.
 *
 *
 * 2. DECISION: COMPETITION LIFECYCLE STATES (STORED vs. COMPUTED)
 * --------------------------------------------------------------------------------------
 * Decision: COMPUTED ON-THE-FLY from date fields + capacity (`spotsTaken`).
 *
 * Primary Lifecycle States:
 *   - `upcoming`            : Current time is prior to the competition registration start window.
 *   - `registration_open`   : Registration is active (now < registerBy AND spotsTaken < totalSpots).
 *   - `registration_closed` : Registration deadline passed OR competition is at max capacity (spotsTaken >= totalSpots).
 *   - `submission_open`     : Submission window is active (now >= submissionStart AND now < submissionEnd).
 *   - `submission_closed`   : Submission window has ended; judging is underway (now >= submissionEnd AND now < resultDate).
 *   - `results_declared`    : Competition concluded and winners announced (now >= resultDate).
 *
 * Technical Justification & Trade-off Analysis:
 *
 * a) Single Source of Truth & Zero State Drift:
 *    Storing the lifecycle state as a static string field in MongoDB creates a dual source of truth.
 *    Because transitions are strictly time-bound (e.g. at 11:50 PM when registration closes, or
 *    when submission ends), a stored status requires continuous external schedulers (cron, BullMQ,
 *    temporal workers) to poll and update documents. If a scheduler lags, drops an event, or worker nodes
 *    experience downtime, the database persists stale status and serves erroneous state to clients.
 *
 * b) Deterministic Computation:
 *    The authoritative timestamps (`registerBy`, `submissionStart`, `submissionEnd`, `resultDate`)
 *    and capacity fields (`totalSpots`, `spotsTaken`) are immutable or strictly controlled. Computing
 *    the lifecycle state at query time via Mongoose virtuals / instance methods (`getLifecycleState()`)
 *    guarantees 100% temporal accuracy, zero scheduling latency, and simplified testing against
 *    arbitrary mock timestamps.
 * ======================================================================================
 */

import { Schema, model, Document, Model } from "mongoose";

export type CompetitionLifecycleState =
  | "upcoming"
  | "registration_open"
  | "registration_closed"
  | "submission_open"
  | "submission_closed"
  | "results_declared";

export interface IReward {
  rank: number;
  amount: number;
  title?: string;
}

export interface IJudge {
  name: string;
  title: string;
  bio: string;
  introVideoUrl?: string;
  avatarUrl?: string;
}

export interface IPreviousWinner {
  name: string;
  rank: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ICompetition {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  spotsTaken: number;
  registerBy: Date;
  submissionStart: Date;
  submissionEnd: Date;
  resultDate: Date;
  rewards: IReward[];
  judge: IJudge;
  rulesAndEligibility: string[];
  judgingParameters: string[];
  previousWinners: IPreviousWinner[];
  bannerUrl?: string;
  certificateProvided?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompetitionDocument extends ICompetition, Document {
  spotsRemaining: number;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  lifecycleState: CompetitionLifecycleState;
  getLifecycleState(asOfDate?: Date): CompetitionLifecycleState;
}

export interface ICompetitionModel extends Model<ICompetitionDocument> {
  findBySlug(slug: string): Promise<ICompetitionDocument | null>;
}

const RewardSchema = new Schema<IReward>(
  {
    rank: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    title: { type: String, trim: true },
  },
  { _id: false }
);

const JudgeSchema = new Schema<IJudge>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    introVideoUrl: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { _id: false }
);

const PreviousWinnerSchema = new Schema<IPreviousWinner>(
  {
    name: { type: String, required: true, trim: true },
    rank: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
  },
  { _id: false }
);

const CompetitionSchema = new Schema<ICompetitionDocument, ICompetitionModel>(
  {
    title: {
      type: String,
      required: [true, "Competition title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Unique competition slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    prizePool: {
      type: Number,
      required: [true, "Prize pool is required"],
      min: [0, "Prize pool cannot be negative"],
    },
    entryFee: {
      type: Number,
      required: [true, "Entry fee is required"],
      min: [0, "Entry fee cannot be negative"],
    },
    totalSpots: {
      type: Number,
      required: [true, "Total spots is required"],
      min: [1, "Total spots must be at least 1"],
    },
    spotsTaken: {
      type: Number,
      default: 0,
      min: [0, "Spots taken cannot be negative"],
    },
    registerBy: {
      type: Date,
      required: [true, "Registration deadline is required"],
      index: true,
    },
    submissionStart: {
      type: Date,
      required: [true, "Submission start date is required"],
    },
    submissionEnd: {
      type: Date,
      required: [true, "Submission deadline is required"],
      index: true,
    },
    resultDate: {
      type: Date,
      required: [true, "Result date is required"],
      index: true,
    },
    rewards: {
      type: [RewardSchema],
      default: [],
      validate: {
        validator: (val: IReward[]) => val.length > 0,
        message: "At least one reward entry must be specified",
      },
    },
    judge: {
      type: JudgeSchema,
      required: [true, "Judge information is required"],
    },
    rulesAndEligibility: {
      type: [String],
      default: [],
    },
    judgingParameters: {
      type: [String],
      default: [],
    },
    previousWinners: {
      type: [PreviousWinnerSchema],
      default: [],
    },
    bannerUrl: {
      type: String,
      trim: true,
    },
    certificateProvided: {
      type: Boolean,
      default: true,
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

// Secondary Indexes for production queries
CompetitionSchema.index({ category: 1, registerBy: 1 });
CompetitionSchema.index({ createdAt: -1 });

// Virtual: Spots remaining (derived dynamically from totalSpots and spotsTaken)
CompetitionSchema.virtual("spotsRemaining").get(function (this: ICompetitionDocument): number {
  return Math.max(0, this.totalSpots - this.spotsTaken);
});

// Virtual: Is registration actively open
CompetitionSchema.virtual("isRegistrationOpen").get(function (this: ICompetitionDocument): boolean {
  const now = new Date();
  return now < this.registerBy && this.spotsTaken < this.totalSpots;
});

// Virtual: Is submission window open
CompetitionSchema.virtual("isSubmissionOpen").get(function (this: ICompetitionDocument): boolean {
  const now = new Date();
  return now >= this.submissionStart && now < this.submissionEnd;
});

/**
 * Deterministically computes the lifecycle state of the competition
 * given a reference timestamp (defaults to current server time).
 */
CompetitionSchema.methods.getLifecycleState = function (
  this: ICompetitionDocument,
  asOfDate: Date = new Date()
): CompetitionLifecycleState {
  const nowTime = asOfDate.getTime();
  const registerByTime = this.registerBy.getTime();
  const submissionStartTime = this.submissionStart.getTime();
  const submissionEndTime = this.submissionEnd.getTime();
  const resultDateTime = this.resultDate.getTime();

  if (nowTime >= resultDateTime) {
    return "results_declared";
  }

  if (nowTime >= submissionEndTime) {
    return "submission_closed";
  }

  // Active submission window
  if (nowTime >= submissionStartTime) {
    // If registration is also still open and capacity remains, the competition is in active submission
    // while welcoming late registrations until registerBy.
    if (nowTime < registerByTime && this.spotsTaken < this.totalSpots) {
      return "submission_open";
    }
    // If registration has passed or filled, submissions remain active
    return "submission_open";
  }

  // Prior to submission window: check registration capacity and deadline
  if (nowTime >= registerByTime || this.spotsTaken >= this.totalSpots) {
    return "registration_closed";
  }

  return "registration_open";
};

// Virtual: Computed lifecycle state based on current time
CompetitionSchema.virtual("lifecycleState").get(function (this: ICompetitionDocument): CompetitionLifecycleState {
  return this.getLifecycleState(new Date());
});

// Static helper to find by slug
CompetitionSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug: slug.toLowerCase() });
};

export const Competition = model<ICompetitionDocument, ICompetitionModel>(
  "Competition",
  CompetitionSchema
);
