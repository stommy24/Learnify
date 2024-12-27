'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareAchievementProps {
  name: string;
  shareMessage: string;
}

export default function ShareAchievement({ name, shareMessage }: ShareAchievementProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const fullMessage = `${shareMessage}\n\nCheck out my achievement "${name}" on Learnify!\n${shareUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${name}`,
          text: fullMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(fullMessage);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Share achievement"
      >
        <Share2 className="w-4 h-4 text-gray-600" />
      </button>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap"
          >
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
