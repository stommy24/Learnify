import { WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { logger } from '@/lib/logger';

interface AlertSystem extends EventEmitter {
  notify: (message: string) => void;
}

export class RealTimeMonitor {
  private wss: WebSocket;
  private updateInterval: number;
  private alertSystem: AlertSystem;

  constructor(url: string, updateInterval = 5000) {
    this.wss = new WebSocket(url);
    this.updateInterval = updateInterval;
    this.alertSystem = new EventEmitter();
    this.initialize();
  }

  private initialize() {
    this.wss.on('open', () => {
      logger.info('WebSocket connection established');
      this.startMonitoring();
    });

    this.wss.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });

    this.wss.on('close', () => {
      logger.warn('WebSocket connection closed');
    });
  }

  private startMonitoring() {
    setInterval(() => {
      if (this.wss.readyState === WebSocket.OPEN) {
        this.wss.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.updateInterval);
  }

  public handleSubscription(topic: string): () => void {
    this.wss.send(JSON.stringify({ type: 'subscribe', topic }));
    return () => {
      this.wss.send(JSON.stringify({ type: 'unsubscribe', topic }));
    };
  }

  public handleUnsubscription(topic: string) {
    this.wss.send(JSON.stringify({ type: 'unsubscribe', topic }));
  }

  public dispose() {
    this.wss.close();
  }
} 