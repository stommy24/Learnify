import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  actions
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}; 
