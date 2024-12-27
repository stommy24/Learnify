import type { AssessmentData, SubmissionData, CompletionData } from '@/types/websocket';
import { connect } from 'socket.io-client';
import React from 'react';

export class AssessmentWebSocket {
  private socket;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    this.socket = connect(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.socket.disconnect();
      }
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    this.socket.on('reconnect', (attemptNumber: any) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });
  }

  joinAssessment(assessmentId: string) {
    this.socket.emit('assessment:join', { assessmentId });
  }

  disconnect() {
    this.socket.disconnect();
  }

  onAssessmentStart(callback: (data: AssessmentData) => void) {
    this.socket.on('assessment:start', callback);
  }

  onAssessmentSubmit(callback: (data: SubmissionData) => void) {
    this.socket.on('assessment:submit', callback);
  }

  onAssessmentComplete(callback: (data: CompletionData) => void) {
    this.socket.on('assessment:complete', callback);
  }
}

// Hook for using WebSocket
export function useAssessmentSocket(assessmentId: string) {
  const socketRef = React.useRef<AssessmentWebSocket>();

  React.useEffect(() => {
    socketRef.current = new AssessmentWebSocket();
    socketRef.current.joinAssessment(assessmentId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [assessmentId]);

  return socketRef.current;
} 