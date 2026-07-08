// backend/src/controller/conversationController.js
// All existing handlers preserved exactly. Two new handlers added at the bottom:
//   • deleteConversation  — hard-deletes conversation + all its messages
//   • handBackToAI        — REST fallback for hand_back_to_ai socket event

import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * @desc Get all conversations
 */
export const getAllConversations = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    let query = Conversation.find(filter)
      .populate('visitorId', 'name email isOnline lastSeen')
      .populate('assignedRecruiter', 'name email')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const conversations = await query;
    const total = await Conversation.countDocuments(filter);

    let filtered = conversations;

    if (search) {
      const s = search.toLowerCase();
      filtered = conversations.filter(
        (c) =>
          c.visitorId?.name?.toLowerCase().includes(s) ||
          c.visitorId?.email?.toLowerCase().includes(s)
      );
    }

    res.json({
      success: true,
      conversations: filtered,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single conversation with messages
 */
export const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('visitorId', 'name email isOnline lastSeen')
      .populate('assignedRecruiter', 'name email');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    await Conversation.findByIdAndUpdate(req.params.id, { unreadCount: 0 });

    res.json({ success: true, conversation, messages });
  } catch (error) {
    next(error);
  }
};

/**
//  * @desc Visitor messages (FIXED PARAMS)
//  */
// export const getVisitorMessages = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const conversation = await Conversation.findById(id);

//     if (!conversation) {
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     const messages = await Message.find({ conversationId: id })
//       .sort({ createdAt: 1 });

//     res.json({ success: true, messages, conversation });
//   } catch (error) {
//     next(error);
//   }
// };


/**
 * @desc Visitor messages (FIXED PARAMS)
 */
export const getVisitorMessages = async (req, res, next) => {
  try {
    const { conversationId, visitorId } = req.params;   // ← match the route's param names

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Optional but recommended: verify this conversation actually belongs
    // to the visitor making the request, so one visitor can't read another's
    // conversation just by guessing/changing the conversationId in the URL.
    if (String(conversation.visitorId) !== String(visitorId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({ success: true, messages, conversation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Assign recruiter
 */
export const assignRecruiter = async (req, res, next) => {
  try {
    const { recruiterId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        assignedRecruiter: recruiterId,
        status: 'HUMAN',
        recruiterJoinedAt: new Date(),
      },
      { new: true }
    ).populate('assignedRecruiter', 'name email');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const io = req.app.get('io');
    io.to('admin_room').emit('conversation_status_update', {
      conversationId: conversation._id,
      status: 'HUMAN',
      recruiterId: conversation.assignedRecruiter?._id,
      recruiterName: conversation.assignedRecruiter?.name,
    });

    res.json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Close conversation
 */
export const closeConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: 'CLOSED', closedAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const systemMsg = await Message.create({
      conversationId: conversation._id,
      senderType: 'system',
      message: 'This conversation has been closed. Thank you for contacting Asliya Recruitment!',
    });

    const io = req.app.get('io');

    io.to(`conversation_${conversation._id}`).emit('conversation_closed', {
      conversationId: conversation._id,
      systemMessage: systemMsg.toObject(),
    });

    io.to('admin_room').emit('conversation_status_update', {
      conversationId: conversation._id,
      status: 'CLOSED',
    });

    res.json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// NEW HANDLERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @desc  Delete a conversation and all its messages (hard delete)
 * @route DELETE /api/conversations/:id
 * @access Admin/Recruiter (protected)
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete all messages belonging to this conversation first
    await Message.deleteMany({ conversationId: conversation._id });

    // Then delete the conversation itself
    await Conversation.findByIdAndDelete(req.params.id);

    // Notify all dashboard tabs to remove it from the list
    const io = req.app.get('io');
    io.to('admin_room').emit('conversation_deleted', {
      conversationId: conversation._id,
    });

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Hand conversation back to AI (REST endpoint — mirrors socket event)
 * @route PUT /api/conversations/:id/hand-back-to-ai
 * @access Admin/Recruiter (protected)
 */
export const handBackToAI = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'AI',
        assignedRecruiter: null,
        recruiterJoinedAt: null,
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const recruiterName = req.user?.name || 'Recruiter';

    const systemMsg = await Message.create({
      conversationId: conversation._id,
      senderType: 'system',
      message: `${recruiterName} has handed this conversation back to the AI assistant.`,
    });

    const io = req.app.get('io');

    // Notify visitor room
    io.to(`conversation_${conversation._id}`).emit('new_message', {
      ...systemMsg.toObject(), isNew: true,
    });

    // Notify all dashboard tabs
    io.to('admin_room').emit('conversation_status_update', {
      conversationId: conversation._id,
      status: 'AI',
      recruiterId: null,
    });

    res.json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};