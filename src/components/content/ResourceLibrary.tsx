import React from 'react';
import { Resource } from '@/types/content';

interface ResourceLibraryProps {
  resources: Resource[];
  onSelect?: (resource: Resource) => void;
  onAdd?: (resource: Resource) => void;
  onRemove?: (resource: Resource) => void;
}

export function ResourceLibrary({ resources, onSelect, onAdd, onRemove }: ResourceLibraryProps) {
  return (
    <div className="grid gap-4">
      {resources.map((resource) => (
        <div key={resource.id} className="p-4 border rounded flex justify-between items-center">
          <div>
            <h3>{resource.title}</h3>
            <p>Type: {resource.type}</p>
          </div>
          <div className="flex gap-2">
            {onSelect && (
              <button onClick={() => onSelect(resource)}>View</button>
            )}
            {onAdd && (
              <button onClick={() => onAdd(resource)}>Add</button>
            )}
            {onRemove && (
              <button onClick={() => onRemove(resource)}>Remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 
