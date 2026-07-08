// backend/src/models/Conversation.js
// Conversation model - tracks each chat session

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: true,
    },
    status: {
      type: String,
      enum: ['AI', 'HUMAN', 'CLOSED'],
      default: 'AI',
    },
    assignedRecruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      default: null,
    },
    // Track if recruiter has joined
    recruiterJoinedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    // Last message preview for dashboard
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Unread count for admin
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
conversationSchema.index({ visitorId: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ assignedRecruiter: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export default mongoose.model('Conversation', conversationSchema);