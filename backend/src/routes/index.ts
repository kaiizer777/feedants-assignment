import { Router } from "express";
import healthRoutes from "./healthRoutes";
import competitionRoutes from "./competitionRoutes";

const router = Router();

router.use(healthRoutes);
router.use(competitionRoutes);

export default router;
