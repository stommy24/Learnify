import { CustomError } from '@/lib/utils/CustomError';

type MediaType = 'diagram' | 'graph' | 'illustration';
type MediaPaths = Record<MediaType, string>;

export class QuestionMediaService {
  private readonly mediaPaths: MediaPaths = {
    diagram: '/media/diagrams/',
    graph: '/media/graphs/',
    illustration: '/media/illustrations/'
  };

  private handleError(message: string): never {
    throw new CustomError('MEDIA_ERROR', message);
  }

  private getMediaPath(type: MediaType): string {
    return this.mediaPaths[type];
  }

  async validateMedia(mediaId: string): Promise<void> {
    try {
      // Validation logic
    } catch (error) {
      this.handleError(`Failed to validate media: ${error}`);
    }
  }

  async processMedia(mediaType: MediaType, mediaId: string): Promise<string> {
    try {
      const path = this.getMediaPath(mediaType);
      return `${path}${mediaId}`;
    } catch (error) {
      this.handleError(`Failed to process media: ${error}`);
    }
  }
} 