import cloudinary from '../config/cloudinary.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

/**
 * @desc Send message with optional attachments
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, senderType, senderId, message } = req.body;

    const attachments = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          url: file.path,
          publicId: file.filename,
          originalName: file.originalname,
          type: file.mimetype.includes('image')
            ? 'image'
            : 'document',
        });
      });
    }

    const newMessage = await Message.create({
      conversationId,
      senderType,
      senderId: senderId || null,
      message:
        message || (attachments.length > 0 ? '📎 Attachment' : ''),
      attachments,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMessage.message,
      lastMessageAt: new Date(),
    });

    const io = req.app.get('io');
    io.to(`conversation_${conversationId}`).emit(
      'new_message',
      newMessage.toObject()
    );

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get messages
 */
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};