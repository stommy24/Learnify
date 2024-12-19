export interface Subject {
  id: string;
  name: string;
  description: string;
  yearGroup: number;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  learningObjectives: string[];
  resources: Resource[];
  order: number;
}

export interface Resource {
  id: string;
  topicId: string;
  title: string;
  type: 'video' | 'document' | 'link' | 'exercise';
  url: string;
  description?: string;
} 