import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useToast } from '@/components/ui/use-toast';
import type {
  RealTimeUpdate,
  LearningPath,
  Performance,
  Schedule
} from '@/types';

export function useRealTimeUpdates() {
  const socket = useSocket();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('update', (update: RealTimeUpdate) => {
      setUpdates(prev => [...prev, update]);
      
      toast({
        title: 'New Update',
        description: `Received update for ${update.type}`,
        type: 'info',
        duration: 3000,
      });
    });

    return () => {
      socket.off('update');
    };
  }, [socket, toast]);

  return { updates };
} 