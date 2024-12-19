import React from 'react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h1 className="font-display font-bold text-3xl text-neutral-text-primary py-8">
            {title}
          </h1>
        )}
        <main className="py-12 sm:py-16 lg:py-20">{children}</main>
      </div>
    </motion.div>
  );
}; 