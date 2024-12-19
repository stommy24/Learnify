import { Content } from '@/types/content';

interface ContentItemProps {
  content: Content;
  onSelect?: (content: Content) => void;
  onEdit?: (content: Content) => void;
  onDelete?: (content: Content) => void;
}

export function ContentItem({ content, onSelect, onEdit, onDelete }: ContentItemProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{content.title}</h3>
      <p className="text-gray-600">{content.description}</p>
      <div className="mt-4 flex gap-2">
        {onSelect && (
          <button onClick={() => onSelect(content)}>View</button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(content)}>Edit</button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(content)}>Delete</button>
        )}
      </div>
    </div>
  );
} 