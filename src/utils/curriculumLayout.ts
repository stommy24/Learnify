import { CurriculumTopic } from '@/types/curriculum';

interface LayoutOptions {
  width: number;
  height: number;
  padding: number;
}

export function calculateTopicPositions(
  topics: CurriculumTopic[],
  options: LayoutOptions = { width: 1000, height: 600, padding: 50 }
): CurriculumTopic[] {
  return topics.map((topic, index) => {
    // Calculate position based on prerequisites and difficulty
    const level = Math.max(0, ...topic.prerequisites.map(preReqId => {
      const preReqTopic = topics.find(t => t.id === preReqId);
      return preReqTopic ? preReqTopic.difficulty : 0;
    }));

    const x = (level * options.width) / 5 + options.padding;
    const y = (index * options.height) / topics.length + options.padding;

    return {
      ...topic,
      position: { x, y }
    };
  });
} 