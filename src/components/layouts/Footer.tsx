import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Learnify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}; 
