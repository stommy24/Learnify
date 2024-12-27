import React from 'react';
import { Card } from '@/components/ui/card';

interface ContentPreviewProps {
  content: any;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  return (
    <Card className="p-4">
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.text }} />
        
        {content.type === 'question' && content.options && (
          <div className="mt-4 space-y-2">
            {content.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="options"
                  id={`option-${index}`}
                  disabled
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}; 


