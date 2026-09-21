import { Router } from "express";
import {
  getCompetitionDetails,
  registerForCompetition,
  submitEntry,
} from "../controllers/competitionController";
import { validateObjectId } from "../middleware/validateObjectId";
import { optionalAuth, requireAuth } from "../middleware/auth";

const router = Router();

// 1. GET /api/competitions/:id - Complete competition details + user state
router.get(
  "/competitions/:id",
  validateObjectId("id"),
  optionalAuth,
  getCompetitionDetails
);

// 2. POST /api/competitions/:id/register - Atomic registration
router.post(
  "/competitions/:id/register",
  validateObjectId("id"),
  requireAuth,
  registerForCompetition
);

// 3. POST /api/competitions/:id/submission - User submission
router.post(
  "/competitions/:id/submission",
  validateObjectId("id"),
  requireAuth,
  submitEntry
);

export default router;
