import { 
  Content, 
  Assessment, 
  Message,
  Thread 
} from '@prisma/client';

export function transformContentForDisplay(content: Content) {
  return {
    ...content,
    createdAt: new Date(content.createdAt).toLocaleDateString(),
    updatedAt: new Date(content.updatedAt).toLocaleDateString(),
    metadata: typeof content.metadata === 'string' 
      ? JSON.parse(content.metadata)
      : content.metadata
  };
}

export function transformAssessmentForSubmission(
  assessment: Assessment,
  answers: Record<string, any>
) {
  return {
    assessmentId: assessment.id,
    answers: Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
      timestamp: new Date().toISOString()
    }))
  };
}

// ... more utility functions 