// backend/routes/project.routes.js
import { Router } from "express";
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  bulkDeleteProjects,
  addPayment,
  deletePayment,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/admin/all", getAdminProjects);
router.post("/", createProject);

// IMPORTANT: "/bulk" must be registered before "/:id",
// otherwise Express matches "bulk" as an :id param and hits deleteProject instead.
router.delete("/bulk", bulkDeleteProjects);

router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

router.patch("/:id/payments", addPayment);
router.delete("/:id/payments/:paymentId", deletePayment);

export default router;