/**
 * ======================================================================================
 * USER MODEL SPECIFICATION (SIMPLIFIED / MOCKED PER SCOPE.MD)
 * ======================================================================================
 *
 * AUTH ASSUMPTION & ARCHITECTURAL SCOPE:
 * --------------------------------------------------------------------------------------
 * Per `scope.md`, full authentication is deliberately out of scope for this assignment.
 * This User model provides the minimal viable schema needed to demonstrate multi-tenant
 * functionality:
 *   1. Differentiating between registered vs. unregistered users on the Competition Details screen.
 *   2. Demonstrating ownership of competition submissions.
 *   3. Preventing duplicate registrations per user.
 *
 * WHAT A PRODUCTION IMPLEMENTATION WOULD REQUIRE INSTEAD:
 * --------------------------------------------------------------------------------------
 * 1. Identity & Provider Integration:
 *    - OAuth 2.0 / OIDC provider (Google, Apple) or managed identity (Supabase / Firebase / Auth0).
 *    - Indian consumer app standard: Phone number authentication with SMS OTP verification.
 * 2. Credential Security:
 *    - Argon2id or bcrypt (cost factor >= 12) for salted password hashing.
 *    - Constant-time verification (`crypto.timingSafeEqual`) to prevent timing attacks.
 * 3. Session & Token Management:
 *    - Cryptographically signed JWTs (short-lived access tokens, 15m) paired with rotating
 *      refresh tokens stored in `httpOnly`, `Secure`, `SameSite=Strict` cookies or secure device keystore.
 *    - Redis-backed token revocation list for instantaneous logout and session invalidation.
 * 4. Access Control & Authorization:
 *    - Role-Based Access Control (RBAC) supporting 'participant', 'judge', 'admin'.
 * 5. Data Privacy & Compliance:
 *    - Field-level encryption at rest for sensitive PII.
 * ======================================================================================
 */

import { Schema, model, Document, Model } from "mongoose";

export interface IUser {
  name: string;
  email?: string;
  mockAuthToken: string; // Static mock token/ID to identify user in request headers
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
  findByMockToken(mockToken: string): Promise<IUserDocument | null>;
}

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mockAuthToken: {
      type: String,
      required: [true, "Mock auth identifier is required"],
      unique: true,
      trim: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
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

UserSchema.statics.findByMockToken = function (mockToken: string) {
  return this.findOne({ mockAuthToken: mockToken });
};

export const User = model<IUserDocument, IUserModel>("User", UserSchema);
