// // backend/routes/auth.routes.js
// import { Router } from "express";
// import { login, me, register } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = Router();

// router.post("/login", login);
// router.post("/register", protect, register); // lock this down (or delete) once your first admin is seeded
// router.get("/me", protect, me);

// export default router;

// backend/routes/auth.routes.js
import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", protect, register); // superadmin-only — see auth.controller.js
router.get("/me", protect, me);

export default router;