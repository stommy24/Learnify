export interface CurriculumContent {
  version: string;
  lastUpdated: string;
  topics: {
    [key: string]: TopicContent;
  };
}

export interface TopicContent {
  yearGroups: {
    [key: number]: YearGroupContent;
  };
}

export interface YearGroupContent {
  terms: {
    [key: number]: TermContent;
  };
}

export interface TermContent {
  objectives: string[];
  keywords: string[];
  expectedOutcomes: string[];
  prerequisites?: string[];
  resources?: string[];
}

export interface CurriculumMapping {
  subject: string;
  yearGroup: number;
  term: number;
  topics: string[];
  objectives: string[];
  prerequisites: string[];
} 