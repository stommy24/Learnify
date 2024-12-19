import { io, Socket } from 'socket.io-client';
import { logger } from './logger';

class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: Socket | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  private initialize() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      logger.info('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      logger.warn('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  }

  public connect(userId: string) {
    if (this.socket) {
      this.socket.auth = { userId };
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public subscribe(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public unsubscribe(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const wsClient = WebSocketClient.getInstance(); 