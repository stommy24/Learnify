import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export function initializeWebSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    path: '/api/ws',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    socket.join(`user:${userId}`);

    socket.on('join:class', (classId) => {
      socket.join(`class:${classId}`);
    });

    socket.on('message:send', async (data) => {
      const message = await prisma.message.create({
        data: {
          content: data.content,
          threadId: data.threadId,
          senderId: userId
        },
        include: {
          sender: true
        }
      });

      io.to(`thread:${data.threadId}`).emit('message:new', message);
    });

    // ... more event handlers
  });

  return io;
} 