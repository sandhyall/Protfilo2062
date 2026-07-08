// backend/routes/revenue.routes.js
import { Router } from "express";
import { getOverview, getMonthlyRevenue, getRevenueByCategory, getRecentPayments } from "../controllers/revenueController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/overview", getOverview);
router.get("/monthly", getMonthlyRevenue);
router.get("/by-category", getRevenueByCategory);
router.get("/recent-payments", getRecentPayments);

export default router;