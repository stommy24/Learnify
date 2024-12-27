import React from 'react';
import { ContentList } from './ContentList';
import { ResourceLibrary } from './ResourceLibrary';
import { useContentManagement } from '@/hooks/useContentManagement';
import type { Content, Resource } from '@/types/content';

export function ContentManagementPanel() {
  const {
    contents,
    resources,
    selectedContent,
    handleContentCreate,
    handleContentUpdate,
    handleContentDelete,
    handleResourceAdd,
    handleResourceRemove
  } = useContentManagement();

  const handleContentSelect = (content: Content) => {
    // Implementation
  };

  const handleResourceSelect = (resource: Resource) => {
    // Implementation
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ContentList
        items={contents}
        onSelect={handleContentSelect}
        onEdit={handleContentUpdate}
        onDelete={handleContentDelete}
      />
      <ResourceLibrary
        resources={resources}
        onSelect={handleResourceSelect}
        onAdd={handleResourceAdd}
        onRemove={handleResourceRemove}
      />
    </div>
  );
} 
