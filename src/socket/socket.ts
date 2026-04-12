import { Server, Socket } from 'socket.io';
import http               from 'http';
import jwt                from 'jsonwebtoken';
import colors             from 'colors';
import { logger, errorLogger } from '../shared/logger';
import config                  from '../config';
import { addUser, removeUser } from './onlineUsers';
import { registerHandlers }    from './socketHandlers';

let io: Server;

export const getIO = (): Server => {
  if (!io) throw new Error('[Socket] Not initialized. Call initSocket(httpServer) first.');
  return io;
};

export const initSocket = (httpServer: http.Server): void => {
  io = new Server(httpServer, {
    cors: {
      origin:      [config.client_url as string, 'http://localhost:3000', 'http://localhost:5173'],
      methods:     ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout:  60000,
    pingInterval: 25000,
  });

  // JWT auth middleware — runs before every connection
  // Token accepted from: auth.token | headers.authorization | query.token
  io.use((socket: Socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization ||
        (socket.handshake.query?.token as string);

      if (!rawToken) return next(new Error('AUTH_ERROR: No token provided'));

      const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;

      const decoded = jwt.verify(token, config.jwt.jwt_secret as string) as {
        id: string; email: string; role: string; name?: string;
      };

      // After next() succeeds, these are guaranteed to be set
      socket.userId   = decoded.id;
      socket.userName = decoded.name || decoded.email;
      socket.userRole = decoded.role;

      next();
    } catch (err: any) {
      errorLogger.error(`[Socket Auth] Failed: ${err.message}`);
      next(new Error('AUTH_ERROR: Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    // Use ! — guaranteed set by JWT middleware above before this fires
    const userId   = socket.userId!;
    const userName = socket.userName!;
    const userRole = socket.userRole!;

    logger.info(colors.green(
      `[Socket] Connected → ${userName} (${userRole}) | userId: ${userId} | socketId: ${socket.id}`,
    ));

    addUser(userId, socket.id);
    socket.broadcast.emit('user:online', { userId, userName, userRole });

    registerHandlers(io, socket);

    socket.on('disconnect', (reason: string) => {
      logger.info(colors.yellow(
        `[Socket] Disconnected → ${userName} | reason: ${reason} | socketId: ${socket.id}`,
      ));
      removeUser(userId);
      socket.broadcast.emit('user:offline', { userId, userName });
    });

    socket.on('error', (err: Error) => {
      errorLogger.error(`[Socket Error] ${userName} | ${err.message}`);
    });
  });

  logger.info(colors.cyan('[Socket] Socket.IO initialized and ready'));
};