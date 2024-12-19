import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket(url: string = process.env.NEXT_PUBLIC_SOCKET_URL || '') {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!url) return;

    socketRef.current = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return socketRef.current;
} 