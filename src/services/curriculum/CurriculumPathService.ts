import { CurriculumStandard, CurriculumTopic, TopicConnection } from '@/types/curriculum';

export class CurriculumPathService {
  private standards: CurriculumStandard[];

  constructor(standards: CurriculumStandard[]) {
    this.standards = standards;
  }

  findTopicById(topicId: string): CurriculumTopic | undefined {
    for (const standard of this.standards) {
      const topic = standard.topics.find((t: CurriculumTopic) => t.id === topicId);
      if (topic) return topic;
    }
    return undefined;
  }

  getTopicConnections(): TopicConnection[] {
    const connections: TopicConnection[] = [];
    
    for (const standard of this.standards) {
      standard.topics.forEach((topic: CurriculumTopic) => {
        topic.prerequisites.forEach((preReqId: string) => {
          connections.push({
            source: preReqId,
            target: topic.id,
            type: 'prerequisite'
          });
        });
      });
    }

    return connections.sort((a: TopicConnection, b: TopicConnection) => 
      a.source.localeCompare(b.source));
  }

  async getCurrentPath(userId: string): Promise<CurriculumTopic[]> {
    const path = await this.fetchUserProgress(userId);
    return path.map(topicId => this.findTopicById(topicId)).filter(Boolean) as CurriculumTopic[];
  }

  async getNextTopic(userId: string): Promise<CurriculumTopic | null> {
    const currentPath = await this.getCurrentPath(userId);
    const lastTopic = currentPath[currentPath.length - 1];
    
    if (!lastTopic) return this.getInitialTopic();
    
    return this.findNextTopic(lastTopic);
  }

  private async fetchUserProgress(userId: string): Promise<string[]> {
    return [];
  }

  private getInitialTopic(): CurriculumTopic | null {
    return this.standards
      .flatMap(s => s.topics)
      .find(t => t.prerequisites.length === 0 && t.difficulty === 1) || null;
  }

  private findNextTopic(currentTopic: CurriculumTopic): CurriculumTopic | null {
    return null;
  }
} 