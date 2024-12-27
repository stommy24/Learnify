import React from 'react';
import type { Content } from '@/types/content';
import { ContentItem } from './ContentItem';

interface ContentListProps {
  items: Content[];
  loading?: boolean;
  onSelect?: (content: Content) => void;
  onEdit?: (content: Content) => void;
  onDelete?: (content: Content) => void;
}

export function ContentList({ items, loading, onSelect, onEdit, onDelete }: ContentListProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <ContentItem 
          key={item.id} 
          content={item}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 
