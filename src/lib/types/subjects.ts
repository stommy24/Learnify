import { Subject } from './base';

export type MathsTopic = 
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'statistics'
  | 'number_patterns'
  | 'word_problems'
  | 'fractions'
  | 'decimals'
  | 'percentages';

export type EnglishTopic = 
  | 'reading_comprehension'
  | 'grammar'
  | 'vocabulary'
  | 'spelling'
  | 'punctuation'
  | 'writing'
  | 'phonics';

export type Topic = MathsTopic | EnglishTopic;

export interface SubjectContent {
  subject: Subject;
  topic: Topic;
  yearGroup: number;
  term: number;
} 