import { AssessmentService } from '../../services/assessment/AssessmentService';
import { api } from '../../api/interceptors';
import { mockAssessment, mockSubmission } from '../mocks/assessment';

jest.mock('../../api/interceptors');

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;

  beforeEach(() => {
    assessmentService = new AssessmentService();
    jest.clearAllMocks();
  });

  describe('createAssessment', () => {
    it('should create an assessment successfully', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockAssessment });

      const result = await assessmentService.createAssessment(mockAssessment);

      expect(api.post).toHaveBeenCalledWith('/assessments', mockAssessment);
      expect(result).toEqual(mockAssessment);
    });

    it('should handle errors when creating assessment', async () => {
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to create'));

      await expect(assessmentService.createAssessment(mockAssessment))
        .rejects
        .toThrow('Failed to create assessment');
    });
  });

  // Add more test cases for other methods
}); 