// backend/routes/stats.routes.js
import { Router } from "express";
import { getOverview, getDailyVisits, getEnquirySources, getTopProjects, getRecentActivity } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/overview", getOverview);
router.get("/visits-daily", getDailyVisits);
router.get("/enquiry-sources", getEnquirySources);
router.get("/top-projects", getTopProjects);
router.get("/recent-activity", getRecentActivity);

export default router;