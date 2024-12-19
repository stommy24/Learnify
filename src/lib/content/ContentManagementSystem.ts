interface Content {
  id: string;
  type: 'lesson' | 'exercise' | 'assessment' | 'resource';
  title: string;
  description: string;
  content: string;
  metadata: {
    author: string;
    createdAt: Date;
    lastModified: Date;
    version: number;
    status: 'draft' | 'review' | 'published' | 'archived';
    tags: string[];
    difficulty: number;
    estimatedDuration: number;
    prerequisites: string[];
  };
  reviewHistory: {
    reviewerId: string;
    timestamp: Date;
    status: 'approved' | 'rejected' | 'needs_revision';
    comments: string;
    version: number;
  }[];
  versionHistory: {
    version: number;
    timestamp: Date;
    authorId: string;
    changes: string;
    content: string;
  }[];
}

export class ContentManagementSystem {
  private static instance: ContentManagementSystem;
  private content: Map<string, Content> = new Map();
  private readonly MAX_VERSIONS = 10;

  private constructor() {}

  static getInstance(): ContentManagementSystem {
    if (!ContentManagementSystem.instance) {
      ContentManagementSystem.instance = new ContentManagementSystem();
    }
    return ContentManagementSystem.instance;
  }

  async createContent(
    draft: Omit<Content, 'id' | 'metadata' | 'reviewHistory' | 'versionHistory'>,
    authorId: string
  ): Promise<Content> {
    const content: Content = {
      ...draft,
      id: `content_${Date.now()}`,
      metadata: {
        author: authorId,
        createdAt: new Date(),
        lastModified: new Date(),
        version: 1,
        status: 'draft',
        tags: [],
        difficulty: 1,
        estimatedDuration: 0,
        prerequisites: []
      },
      reviewHistory: [],
      versionHistory: [{
        version: 1,
        timestamp: new Date(),
        authorId,
        changes: 'Initial creation',
        content: draft.content
      }]
    };

    this.content.set(content.id, content);
    await this.persistContent(content);
    return content;
  }

  async updateContent(
    contentId: string,
    updates: Partial<Content>,
    authorId: string
  ): Promise<Content> {
    const existing = this.content.get(contentId);
    if (!existing) throw new Error('Content not found');

    const newVersion = existing.metadata.version + 1;
    const updated: Content = {
      ...existing,
      ...updates,
      metadata: {
        ...existing.metadata,
        lastModified: new Date(),
        version: newVersion
      },
      versionHistory: [
        {
          version: newVersion,
          timestamp: new Date(),
          authorId,
          changes: updates.content ? 'Content updated' : 'Metadata updated',
          content: updates.content || existing.content
        },
        ...existing.versionHistory.slice(0, this.MAX_VERSIONS - 1)
      ]
    };

    this.content.set(contentId, updated);
    await this.persistContent(updated);
    return updated;
  }

  async submitForReview(
    contentId: string,
    authorId: string
  ): Promise<Content> {
    const content = this.content.get(contentId);
    if (!content) throw new Error('Content not found');
    if (content.metadata.status !== 'draft') {
      throw new Error('Only draft content can be submitted for review');
    }

    const updated = await this.updateContent(
      contentId,
      {
        metadata: {
          ...content.metadata,
          status: 'review'
        }
      },
      authorId
    );

    await this.notifyReviewers(updated);
    return updated;
  }

  async reviewContent(
    contentId: string,
    reviewerId: string,
    decision: 'approved' | 'rejected' | 'needs_revision',
    comments: string
  ): Promise<Content> {
    const content = this.content.get(contentId);
    if (!content) throw new Error('Content not found');
    if (content.metadata.status !== 'review') {
      throw new Error('Content is not in review status');
    }

    const newStatus = decision === 'approved' ? 'published' : 'draft';
    const updated = await this.updateContent(
      contentId,
      {
        metadata: {
          ...content.metadata,
          status: newStatus
        },
        reviewHistory: [
          {
            reviewerId,
            timestamp: new Date(),
            status: decision,
            comments,
            version: content.metadata.version
          },
          ...content.reviewHistory
        ]
      },
      reviewerId
    );

    await this.notifyAuthor(updated, decision);
    return updated;
  }

  async archiveContent(
    contentId: string,
    authorId: string
  ): Promise<Content> {
    return this.updateContent(
      contentId,
      {
        metadata: {
          status: 'archived'
        } as Partial<Content['metadata']>
      },
      authorId
    );
  }

  async getContentVersion(
    contentId: string,
    version: number
  ): Promise<Content | null> {
    const content = this.content.get(contentId);
    if (!content) return null;

    const historicalVersion = content.versionHistory.find(
      v => v.version === version
    );
    if (!historicalVersion) return null;

    return {
      ...content,
      content: historicalVersion.content,
      metadata: {
        ...content.metadata,
        version: historicalVersion.version
      }
    };
  }

  private async persistContent(content: Content): Promise<void> {
    // Implement database persistence
  }

  private async notifyReviewers(content: Content): Promise<void> {
    // Implement reviewer notification
  }

  private async notifyAuthor(
    content: Content,
    decision: 'approved' | 'rejected' | 'needs_revision'
  ): Promise<void> {
    // Implement author notification
  }
}

export const useContentManagement = () => {
  const cms = ContentManagementSystem.getInstance();
  return {
    createContent: cms.createContent.bind(cms),
    updateContent: cms.updateContent.bind(cms),
    submitForReview: cms.submitForReview.bind(cms),
    reviewContent: cms.reviewContent.bind(cms),
    archiveContent: cms.archiveContent.bind(cms),
    getContentVersion: cms.getContentVersion.bind(cms)
  };
}; 