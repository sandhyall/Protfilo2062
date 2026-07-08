
import Visitor from '../models/Visitor.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Recruiter from '../models/Recruiter.js';
import Admin from '../models/AdminModel.js';
import { generateAIResponse } from '../services/aiService.js';
import {
  sendNewChatNotification,
  sendNewMessageNotification,
} from '../services/emailService.js';

// ── Email throttle: one email per conversation per 5 minutes ─────────────────
const emailThrottle = new Map(); // conversationId → timestamp

const shouldSendEmail = (conversationId) => {
  const last = emailThrottle.get(String(conversationId));
  const now  = Date.now();
  if (!last || now - last > 5 * 60 * 1000) {
    emailThrottle.set(String(conversationId), now);
    return true;
  }
  return false;
};

// ── Fetch all admin/recruiter emails for notifications ────────────────────────
// Recruiter model holds both role:'admin' and role:'recruiter' staff.
// Admin model (Adminuser) is a simpler schema with just email + password + role
// — it has no `name` field, but the email field is present.
const getAdminEmails = async () => {
  try {
    const [recruiters, admins] = await Promise.all([
      Recruiter.find({}).select('email').lean(),
      Admin.find({}).select('email').lean(),
    ]);
    const emails = [
      ...recruiters.map((r) => r.email),
      ...admins.map((a) => a.email),
    ].filter(Boolean);
    // Deduplicate (a person might exist in both collections)
    return [...new Set(emails)];
  } catch (err) {
    console.error('getAdminEmails error:', err.message);
    return [];
  }
};


// ── TEMP: Use .env emails only (ignore DB) ──
// const getAdminEmails = async () => {
//   try {
//     if (!process.env.RECIPIENT_EMAILS) {
//       console.warn('⚠️ RECIPIENT_EMAILS not set in .env');
//       return [];
//     }

//     const emails = process.env.RECIPIENT_EMAILS
//       .split(',')
//       .map((email) => email.trim())
//       .filter(Boolean);

//     return [...new Set(emails)];
//   } catch (err) {
//     console.error('getAdminEmails error:', err.message);
//     return [];
//   }
// };




export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── VISITOR JOIN ────────────────────────────────────────────────────────
    socket.on('visitor_join', async ({ visitorId, conversationId }) => {
      try {
        await Visitor.findByIdAndUpdate(visitorId, {
          socketId: socket.id, isOnline: true, lastSeen: new Date(),
        });
        socket.join(`conversation_${conversationId}`);
        socket.visitorId      = visitorId;
        socket.conversationId = conversationId;
        socket.role           = 'visitor';
        io.to('admin_room').emit('visitor_online', { visitorId, conversationId, socketId: socket.id });
      } catch (error) {
        console.error('visitor_join error:', error.message);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // ── VISITOR MESSAGE ─────────────────────────────────────────────────────
    socket.on('visitor_message', async ({ conversationId, visitorId, message }) => {
      try {
        const visitorMsg = await Message.create({
          conversationId, senderType: 'visitor', senderId: visitorId, message: message.trim(),
        });

        // Count only visitor messages to detect "first message"
        const msgCount = await Message.countDocuments({ conversationId, senderType: 'visitor' });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message.trim(), lastMessageAt: new Date(), $inc: { unreadCount: 1 },
        });

        io.to(`conversation_${conversationId}`).emit('new_message', {
          ...visitorMsg.toObject(), isNew: true,
        });
        io.to('admin_room').emit('visitor_message_to_admin', {
          conversationId, _id: visitorMsg._id, message: visitorMsg.message, createdAt: visitorMsg.createdAt,
        });

        const conversation = await Conversation.findById(conversationId)
          .populate('visitorId', 'name email')
          .lean();

        // ── Email notification — AI mode only, throttled ──────────────────
        if (conversation?.status === 'AI' && shouldSendEmail(conversationId)) {
          // Fire-and-forget but capture errors — never block the socket handler
          ;(async () => {
            try {
              const recipientEmails = await getAdminEmails();
              if (!recipientEmails.length) {
                console.warn('⚠️  No admin/recruiter emails found — email not sent.');
                return;
              }

              const visitorName  = conversation.visitorId?.name  || 'Unknown';
              const visitorEmail = conversation.visitorId?.email || '';

              if (msgCount === 1) {
                // First visitor message → "new chat" notification
                await sendNewChatNotification({
                  visitorName,
                  visitorEmail,
                  firstMessage: message.trim(),
                  conversationId,
                  recipientEmails,
                });
              } else {
                // Subsequent messages → lighter "new message" notification
                await sendNewMessageNotification({
                  visitorName,
                  visitorEmail,
                  message: message.trim(),
                  conversationId,
                  recipientEmails,
                });
              }
            } catch (emailErr) {
              console.error('Email notification error:', emailErr.message);
            }
          })();
        }

        // ── AI auto-reply (unchanged) ─────────────────────────────────────
        if (conversation?.status === 'AI') {
          io.to(`conversation_${conversationId}`).emit('ai_typing', { conversationId, isTyping: true });
          const recentMessages = await Message.find({ conversationId }).sort({ createdAt: -1 }).limit(10).lean();
          const history = recentMessages.reverse();
          const delay   = Math.min(1000 + message.length * 30, 3000);
          setTimeout(async () => {
            try {
              const aiText = await generateAIResponse(history);
              const aiMsg  = await Message.create({
                conversationId, senderType: 'ai', senderId: null, message: aiText,
              });
              await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: aiText, lastMessageAt: new Date(),
              });
              io.to(`conversation_${conversationId}`).emit('ai_typing', { conversationId, isTyping: false });
              io.to(`conversation_${conversationId}`).emit('new_message', { ...aiMsg.toObject(), isNew: true });
              io.to('admin_room').emit('ai_response_to_admin', {
                conversationId, _id: aiMsg._id, message: aiMsg.message, createdAt: aiMsg.createdAt,
              });
            } catch (err) {
              console.error('AI error:', err.message);
              io.to(`conversation_${conversationId}`).emit('ai_typing', { conversationId, isTyping: false });
            }
          }, delay);
        }
      } catch (error) {
        console.error('visitor_message error:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── RECRUITER CONNECT ───────────────────────────────────────────────────
    socket.on('recruiter_connect', async ({ recruiterId }) => {
      try {
        let agent = await Recruiter.findByIdAndUpdate(
          recruiterId,
          { socketId: socket.id, isOnline: true, lastSeen: new Date() },
          { new: true }
        );
        if (!agent) {
          agent = await Admin.findByIdAndUpdate(
            recruiterId,
            { socketId: socket.id, isOnline: true, lastSeen: new Date() },
            { new: true }
          );
        }

        socket.join('admin_room');
        socket.role        = 'recruiter';
        socket.recruiterId = recruiterId;

        const activeConvs = await Conversation.find({
          assignedRecruiter: recruiterId,
          status: 'HUMAN',
        }).select('_id');

        for (const conv of activeConvs) {
          socket.join(`conversation_${conv._id}`);
          console.log(`👔 Recruiter ${recruiterId} re-joined conversation_${conv._id}`);
        }

        console.log(`👔 Recruiter/Admin ${recruiterId} joined admin_room`);
        socket.emit('admin_joined', { message: 'Connected to admin room' });
      } catch (error) {
        console.error('recruiter_connect error:', error.message);
      }
    });

    // ── RECRUITER JOIN CONVERSATION ─────────────────────────────────────────
    socket.on('recruiter_join_conversation', async ({ recruiterId, conversationId }) => {
      try {
        let recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) recruiter = await Admin.findById(recruiterId);
        if (!recruiter) return;

        await Conversation.findByIdAndUpdate(conversationId, {
          status: 'HUMAN', assignedRecruiter: recruiterId,
          recruiterJoinedAt: new Date(), unreadCount: 0,
        });

        socket.join(`conversation_${conversationId}`);

        const systemMsg = await Message.create({
          conversationId, senderType: 'system',
          message: `${recruiter.name || 'A recruiter'} has joined the conversation.`,
        });

        io.to(`conversation_${conversationId}`).emit('recruiter_joined', {
          recruiter, recruiterName: recruiter.name, systemMessage: systemMsg.toObject(),
        });
        io.to('admin_room').emit('conversation_status_update', {
          conversationId, status: 'HUMAN', recruiterId, recruiterName: recruiter.name,
        });
      } catch (error) {
        console.error('recruiter_join_conversation error:', error.message);
      }
    });

    // ── HAND BACK TO AI ─────────────────────────────────────────────────────
    socket.on('hand_back_to_ai', async ({ conversationId, recruiterId }) => {
      try {
        let recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) recruiter = await Admin.findById(recruiterId);

        await Conversation.findByIdAndUpdate(conversationId, {
          status: 'AI',
          assignedRecruiter: null,
          recruiterJoinedAt: null,
        });

        const recruiterName = recruiter?.name || 'Recruiter';
        const systemMsg = await Message.create({
          conversationId,
          senderType: 'system',
          message: `${recruiterName} has handed this conversation back to the AI assistant.`,
        });

        io.to(`conversation_${conversationId}`).emit('new_message', {
          ...systemMsg.toObject(), isNew: true,
        });
        io.to('admin_room').emit('conversation_status_update', {
          conversationId,
          status: 'AI',
          recruiterId: null,
        });

        console.log(`🤖 Conversation ${conversationId} handed back to AI by ${recruiterName}`);
      } catch (error) {
        console.error('hand_back_to_ai error:', error.message);
        socket.emit('error', { message: 'Failed to hand back to AI' });
      }
    });

    // ── RECRUITER MESSAGE ───────────────────────────────────────────────────
    socket.on('recruiter_message', async ({ conversationId, recruiterId, message }) => {
      try {
        let recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) recruiter = await Admin.findById(recruiterId);
        if (!recruiter) return;

        const msg = await Message.create({
          conversationId,
          senderType: 'recruiter',
          senderId:   recruiterId,
          senderName: recruiter.name,
          message:    message.trim(),
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message.trim(), lastMessageAt: new Date(),
        });

        socket.join(`conversation_${conversationId}`);

        io.to(`conversation_${conversationId}`).emit('new_message', {
          ...msg.toObject(),
          senderName:    recruiter.name,
          recruiterName: recruiter.name,
        });

        io.to('admin_room').emit('visitor_message_to_admin', {
          conversationId, _id: msg._id, message: msg.message, createdAt: msg.createdAt,
        });
      } catch (error) {
        console.error('recruiter_message error:', error.message);
      }
    });

    // ── CLOSE CONVERSATION ──────────────────────────────────────────────────
    socket.on('close_conversation', async ({ conversationId }) => {
      try {
        await Conversation.findByIdAndUpdate(conversationId, { status: 'CLOSED', closedAt: new Date() });
        const systemMsg = await Message.create({
          conversationId, senderType: 'system',
          message: 'This conversation has been closed. Thank you for contacting Asliya Recruitment!',
        });
        io.to(`conversation_${conversationId}`).emit('conversation_closed', {
          conversationId, systemMessage: systemMsg.toObject(),
        });
        io.to('admin_room').emit('conversation_status_update', { conversationId, status: 'CLOSED' });
      } catch (error) {
        console.error('close_conversation error:', error.message);
      }
    });

    // ── TYPING ──────────────────────────────────────────────────────────────
    socket.on('typing', ({ conversationId, senderType }) => {
      if (senderType === 'recruiter') {
        socket.to(`conversation_${conversationId}`).emit('recruiter_typing');
      } else {
        socket.to(`conversation_${conversationId}`).emit('typing', { senderType, isTyping: true });
      }
    });
    socket.on('stop_typing', ({ conversationId, senderType }) => {
      if (senderType === 'recruiter') {
        socket.to(`conversation_${conversationId}`).emit('recruiter_stop_typing');
      } else {
        socket.to(`conversation_${conversationId}`).emit('typing', { senderType, isTyping: false });
      }
    });

    // ── DISCONNECT ──────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔌 Disconnected: ${socket.id}`);
      try {
        if (socket.visitorId) {
          await Visitor.findByIdAndUpdate(socket.visitorId, { isOnline: false, lastSeen: new Date() });
          io.to('admin_room').emit('visitor_offline', {
            visitorId: socket.visitorId, conversationId: socket.conversationId,
          });
        }
        if (socket.recruiterId) {
          const updated = await Recruiter.findByIdAndUpdate(
            socket.recruiterId, { isOnline: false, lastSeen: new Date() }
          );
          if (!updated) {
            await Admin.findByIdAndUpdate(socket.recruiterId, { isOnline: false, lastSeen: new Date() });
          }
        }
      } catch (err) {
        console.error('disconnect error:', err.message);
      }
    });
  });
};