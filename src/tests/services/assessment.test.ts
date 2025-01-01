import { AssessmentService } from '@/services/assessment/AssessmentService';
import { jest } from '@jest/globals';

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;
  let mockApi: any;

  beforeEach(() => {
    mockApi = {
      post: jest.fn()
    };
    assessmentService = new AssessmentService(mockApi);
  });

  describe('createAssessment', () => {
    test('should create an assessment successfully', async () => {
      const mockAssessment = { title: 'Test Assessment' };
      mockApi.post.mockResolvedValueOnce({ data: mockAssessment });

      const result = await assessmentService.createAssessment(mockAssessment);
      expect(mockApi.post).toHaveBeenCalledWith('/assessments', mockAssessment);
      expect(result).toEqual(mockAssessment);
    });

    test('should handle errors when creating assessment', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Failed to create'));
      await expect(assessmentService.createAssessment({}))
        .rejects
        .toThrow('Failed to create assessment');
    });
  });
}); 