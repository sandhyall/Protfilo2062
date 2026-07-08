// // backend/src/models/Message.js
// // Message model - individual chat messages
// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema(
//   {
//     conversationId: {
//       type: mongoose.Schema.Types.ObjectId
//       ref: 'Conversation',
//       required: true,
//     },
//     senderType: {
//       type: String,
//       enum: ['visitor', 'ai', 'recruiter', 'system'],
//       required: true,
//     },
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       // Can ref Visitor, Recruiter or null for AI/system
//       default: null,
//     },
//     message: {
//       type: String,
//       required: [true, 'Message cannot be empty'],
//       trim: true,
//       maxlength: [5000, 'Message cannot exceed 5000 characters'],
//     },
//     // For file/document messages
//     attachments: [
//       {
//         url: String,
//         publicId: String,
//         originalName: String,
//         type: String, // 'image', 'pdf', 'doc'
//       },
//     ],
//     // Read receipts
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes for efficient conversation message loading
// messageSchema.index({ conversationId: 1, createdAt: 1 });

// export default mongoose.model('Message', messageSchema);
// backend/src/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderType: {
      type: String,
      enum: ['visitor', 'ai', 'recruiter', 'system'],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    // FIX 3: persist the recruiter's display name so REST responses
    // (e.g. page refresh loading history) include it — not just socket payloads
    senderName: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    attachments: [
      {
        url: String,
        publicId: String,
        originalName: String,
        type: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);