// backend/server.js
// Main entry point - sets up Express app, Socket.io, MongoDB connection

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Internal imports
import { connectDB } from './config/db.js';
import { initializeSocket } from './socket/socketServer.js';
import { mongoSanitizeMiddleware } from './middleware/mongoSanitizeMiddleware.js';


// Chat / recruitment app routes
import authRoutes from './routes/authRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';

// Admin / dashboard routes

import blogRoutes from './routes/blogRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import EnquiryRoutes from './routes/EnquiryRoutes.js';
import visitRoutes from "./routes/visitRoutes.js";


// Sandesh Innovations routes
import projectRoutes from './routes/projectRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// ─── Allowed Origins (env-driven, works for local + hosted) ───────────
// Set CLIENT_URLS as a comma-separated list in production, e.g.:
// CLIENT_URLS=https://www.asliyarecruitment.com,https://asliyarecruitment.com
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  'http://localhost:5173,http://localhost:5174'
)
  .split(',')
  .map((s) => s.trim().replace(/\/$/, '')) // strip trailing slash
  .filter(Boolean);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.log('Blocked Socket origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSocket(io);

// Make io accessible in routes/controllers
app.set('io', io);

// ─── CORS (placed first so it always responds, even on later errors) ──
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

// ─── Security Middlewares ────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitizeMiddleware);

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200,
//   message: { error: 'Too many requests, please try again later.' },
// });
// app.use('/api/', limiter);

// ─── Rate limiting ────────────────────────────────────────────────────

// Strict limiter — for auth, admin, chat, dashboard endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) =>
    req.originalUrl.startsWith('/api/visits') ||
    req.originalUrl.startsWith('/api/enquiries'),
});
app.use('/api/', generalLimiter);

// Looser limiter — public-facing endpoints hit by many website visitors,
// sometimes from a shared IP (office, campus wifi, VPN)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/visits', publicLimiter);
app.use('/api/enquiries', publicLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads (from Sandesh Innovations server.js)
app.use('/uploads', express.static(path.resolve('uploads')));

// ─── API Routes: chat / recruitment app ──────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
// app.use('/api/ai', aiRoutes);

// ─── API Routes: admin / dashboard ───────────────────────────────────

app.use('/api/blog', blogRoutes);


app.use('/api/stats', statsRoutes);
app.use('/api/enquiries', EnquiryRoutes);
app.use("/api/visits", visitRoutes);


// ─── API Routes: Sandesh Innovations ─────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/revenue', revenueRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API running' });
});
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API running' });
});

// ─── Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
console.log('Allowed origins:', allowedOrigins);

export default { app, io };