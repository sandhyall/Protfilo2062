import express from "express";
import { trackVisit } from "../controllers/visitController.js";

const router = express.Router();

router.post("/", trackVisit);

export default router;