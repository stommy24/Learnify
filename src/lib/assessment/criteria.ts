export class AssessmentCriteria {
  validateAnswer(answer: string, correctAnswer: string): boolean {
    return answer === correctAnswer;
  }

  calculateScore(correct: number, total: number): number {
    return (correct / total) * 100;
  }
} 