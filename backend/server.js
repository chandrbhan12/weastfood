import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import http from 'http';
import { Server as IOServer } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);

app.get('/api', (req, res) => {
  res.json({ 
    message: 'FoodLink API',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me, /api/auth/logout',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Client-side routing fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: '*',
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  // client should send an `identify` event with their user id to join a private room
  socket.on('identify', (userId) => {
    try {
      if (!userId) return;
      socket.join(`user:${userId}`);
    } catch (e) {
      console.warn('identify error', e);
    }
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
