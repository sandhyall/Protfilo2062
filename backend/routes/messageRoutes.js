import express from 'express';
import {
  sendMessage,
  getMessages,
} from '../controllers/messageController.js';

import { protect } from '../middleware/authMiddleware.js';

import multer from 'multer';

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Send message
router.post('/', upload.array('attachments', 5), sendMessage);

// Get messages
router.get('/:conversationId', protect, getMessages);

export default router;