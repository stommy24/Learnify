import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    setToasts((prev) => [...prev, options]);
    if (options.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, options.duration);
    }
  }, []);

  return { toast, toasts };
} 