'use client';

import Image from 'next/image';
import { useState } from 'react';

interface QuestionMediaProps {
  media: {
    url: string;
    alt: string;
    type: 'diagram' | 'graph' | 'illustration';
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  className?: string;
}

export default function QuestionMedia({ 
  media,
  className = ''
}: QuestionMediaProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {error ? (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded">
          Failed to load image
        </div>
      ) : (
        <Image
          src={media.url}
          alt={media.alt}
          width={400}
          height={400}
          className="rounded-lg"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError('Failed to load image');
          }}
        />
      )}
    </div>
  );
} 