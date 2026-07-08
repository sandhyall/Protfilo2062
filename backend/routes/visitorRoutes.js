import express from 'express';
import {
  identifyVisitor,
  getAllVisitors,
  getVisitor,
} from '../controllers/visitorController.js';

import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

// Public
router.post('/identify', identifyVisitor);

// Admin
router.get('/', protect, getAllVisitors);
router.get('/:id', protect, getVisitor);

export default router;