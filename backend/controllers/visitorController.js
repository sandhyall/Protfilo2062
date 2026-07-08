import Visitor from '../models/Visitor.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * @desc Identify visitor by email
 */
export const identifyVisitor = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    let visitor = await Visitor.findOne({ email: email.toLowerCase().trim() });
    let isReturning = false;
    let conversation = null;

    if (visitor) {
      isReturning = true;

      visitor.name = name.trim();
      visitor.lastSeen = new Date();
      await visitor.save();

      conversation = await Conversation.findOne({
        visitorId: visitor._id,
        status: { $ne: 'CLOSED' },
      })
        .sort({ createdAt: -1 })
        .populate('assignedRecruiter', 'name email');
    } else {
      visitor = await Visitor.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        visitorId: visitor._id,
        status: 'AI',
      });

      const greetingMsg = await Message.create({
        conversationId: conversation._id,
        senderType: 'ai',
        senderId: null,
        message: `Hello ${visitor.name}! 👋 Welcome to Sandesh Innovations ... How can we help you?`,
      });

      // Keep the conversation doc's preview in sync with the greeting.
      conversation.lastMessage = greetingMsg.message;
      conversation.lastMessageAt = greetingMsg.createdAt;
      await conversation.save();

      // This was the missing piece — nothing told the dashboard a new
      // conversation had been created. Only fires here, inside the
      // "genuinely new" branch, so returning visitors reusing an existing
      // open conversation don't produce a duplicate dashboard entry.
      const io = req.app.get('io');
      io.to('admin_room').emit('new_conversation', {
        _id: conversation._id,
        status: conversation.status,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: 0,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        visitorId: {
          _id: visitor._id,
          name: visitor.name,
          email: visitor.email,
          isOnline: visitor.isOnline,
          lastSeen: visitor.lastSeen,
        },
        assignedRecruiter: null,
      });
    }

    // Fetch full message history for this conversation — includes the
    // greeting we just created on a brand-new conversation, or prior
    // messages if the visitor is returning to a still-open conversation.
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      isReturning,
      visitor: {
        _id: visitor._id,
        name: visitor.name,
        email: visitor.email,
      },
      conversation: {
        _id: conversation._id,
        status: conversation.status,
        assignedRecruiter: conversation.assignedRecruiter,
      },
      messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all visitors
 */
export const getAllVisitors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const visitors = await Visitor.find()
      .sort({ lastSeen: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Visitor.countDocuments();

    res.json({
      success: true,
      visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single visitor
 */
export const getVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    const conversations = await Conversation.find({
      visitorId: visitor._id,
    })
      .populate('assignedRecruiter', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, visitor, conversations });
  } catch (error) {
    next(error);
  }
};

// Add this to visitorController.js

/**
 * @desc Check if visitor email exists (used by chat form)
 * POST /api/visitors/check-email
 */
export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const visitor = await Visitor.findOne({ email: email.toLowerCase().trim() })

    if (visitor) {
      return res.json({ exists: true, visitor: { name: visitor.name } })
    }

    res.json({ exists: false })
  } catch (error) {
    next(error)
  }
}