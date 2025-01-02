'use client';

import { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';

interface DragDropZoneProps {
  question: any;
  onAnswer: (items: any) => void;
  value?: any;
  isMobile: boolean;
}

export default function DragDropZone({
  question,
  onAnswer,
  value,
  isMobile
}: DragDropZoneProps) {
  const [items, setItems] = useState(value?.items || question.items);
  const dragConstraintsRef = useRef(null);

  const handleReorder = (newOrder: any[]) => {
    setItems(newOrder);
    onAnswer({ items: newOrder });
  };

  return (
    <div 
      ref={dragConstraintsRef}
      className="p-4 border rounded-lg bg-gray-50"
    >
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item: any) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="bg-white p-3 rounded shadow cursor-move"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.content}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
} 