export const mockAssessment = {
  id: '1',
  title: 'Test Assessment',
  description: 'Test Description',
  subjectId: '1',
  yearGroup: 9,
  duration: 60,
  totalPoints: 100,
  passingScore: 60,
  questions: [],
  status: 'draft' as const,
  dueDate: '2024-12-31T23:59:59Z',
  createdAt: '2024-04-12T00:00:00Z',
  updatedAt: '2024-04-12T00:00:00Z',
};

export const mockSubmission = {
  id: '1',
  assessmentId: '1',
  userId: '1',
  answers: {},
  submittedAt: '2024-04-12T00:00:00Z',
}; 