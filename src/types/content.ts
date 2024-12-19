export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'link';
  url: string;
  format?: string;
  size?: number;
  duration?: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  status: 'draft' | 'published' | 'archived';
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
  };
  resources: Resource[];
  tags: string[];
} 