// backend/src/routes/conversationRoutes.js
// All existing routes preserved. Two new routes added:
//   DELETE /:id              — deleteConversation
//   PUT    /:id/hand-back-to-ai — handBackToAI

import express from 'express';
import {
  getAllConversations,
  getConversation,
  getVisitorMessages,
  assignRecruiter,
  closeConversation,
  deleteConversation,
  handBackToAI,
} from '../controllers/conversationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public visitor route ──────────────────────────────────────────────────────
router.get('/:conversationId/visitor/:visitorId', getVisitorMessages);

// ── Admin / recruiter routes (all protected) ──────────────────────────────────
router.get('/',    protect, getAllConversations);
router.get('/:id', protect, getConversation);
router.put('/:id/assign',           protect, assignRecruiter);
router.put('/:id/close',            protect, closeConversation);
router.put('/:id/hand-back-to-ai',  protect, handBackToAI);   // NEW
router.delete('/:id',               protect, deleteConversation); // NEW

export default router;