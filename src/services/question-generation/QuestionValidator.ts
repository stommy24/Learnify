export class QuestionValidator {
  async validate(question: any, standards: CurriculumStandard[]): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate basic structure
    if (!this.validateStructure(question)) {
      errors.push('Question does not match required structure');
    }

    // Validate curriculum alignment
    if (!this.validateCurriculumAlignment(question, standards)) {
      errors.push('Question does not align with curriculum standards');
    }

    // Validate difficulty level
    if (!this.validateDifficulty(question)) {
      errors.push('Question difficulty does not match required level');
    }

    // Validate question type specific requirements
    if (!this.validateTypeSpecificRequirements(question)) {
      errors.push('Question does not meet type-specific requirements');
    }

    // Validate marking criteria
    if (!this.validateMarkingCriteria(question)) {
      errors.push('Invalid marking criteria');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateStructure(question: any): boolean {
    const requiredFields = [
      'questionText',
      'type',
      'difficulty',
      'alignedObjective',
      'points',
      'correctAnswer',
      'explanation',
      'markingCriteria'
    ];

    return requiredFields.every(field => question.hasOwnProperty(field));
  }

  private validateCurriculumAlignment(question: any, standards: CurriculumStandard[]): boolean {
    return standards.some(standard =>
      standard.learningObjectives.includes(question.alignedObjective)
    );
  }

  private validateDifficulty(question: any): boolean {
    const validDifficulties = ['easy', 'medium', 'hard'];
    return validDifficulties.includes(question.difficulty);
  }

  private validateTypeSpecificRequirements(question: any): boolean {
    switch (question.type) {
      case 'multiple-choice':
        return this.validateMultipleChoice(question);
      case 'short-answer':
        return this.validateShortAnswer(question);
      case 'essay':
        return this.validateEssay(question);
      default:
        return false;
    }
  }

  private validateMultipleChoice(question: any): boolean {
    return (
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.includes(question.correctAnswer)
    );
  }

  private validateShortAnswer(question: any): boolean {
    return (
      typeof question.correctAnswer === 'string' &&
      question.correctAnswer.length > 0
    );
  }

  private validateEssay(question: any): boolean {
    return (
      typeof question.markingCriteria === 'string' &&
      question.markingCriteria.length > 0
    );
  }

  private validateMarkingCriteria(question: any): boolean {
    return (
      typeof question.markingCriteria === 'string' &&
      question.markingCriteria.length > 0 &&
      question.points > 0
    );
  }
} 