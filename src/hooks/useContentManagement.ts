import { useState, useCallback } from 'react';
import type { Content, Resource } from '@/types/content';

export function useContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handleContentCreate = useCallback((content: Content) => {
    setContents(prev => [...prev, content]);
  }, []);

  const handleContentUpdate = useCallback((content: Content) => {
    setContents(prev => prev.map(c => c.id === content.id ? content : c));
  }, []);

  const handleContentDelete = useCallback((content: Content) => {
    setContents(prev => prev.filter(c => c.id !== content.id));
  }, []);

  const handleResourceAdd = useCallback((resource: Resource) => {
    setResources(prev => [...prev, resource]);
  }, []);

  const handleResourceRemove = useCallback((resource: Resource) => {
    setResources(prev => prev.filter(r => r.id !== resource.id));
  }, []);

  return {
    contents,
    resources,
    selectedContent,
    setSelectedContent,
    handleContentCreate,
    handleContentUpdate,
    handleContentDelete,
    handleResourceAdd,
    handleResourceRemove
  };
} 