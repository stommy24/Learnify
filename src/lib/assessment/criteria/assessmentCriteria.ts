import { LearningObjective, ValidationRule } from '@/types/curriculum';

export class AssessmentCriteria {
  generateCriteria(objective: LearningObjective, subject: 'maths' | 'english'): ValidationRule[] {
    if (subject === 'maths') {
      return this.generateMathsCriteria(objective);
    } else {
      return this.generateEnglishCriteria(objective);
    }
  }

  private generateMathsCriteria(objective: LearningObjective): ValidationRule[] {
    const criteria: ValidationRule[] = [
      {
        type: 'method',
        value: {
          requiredSteps: this.extractRequiredSteps(objective),
          workingOut: true
        },
        errorMessage: 'Please show your working out'
      },
      {
        type: 'accuracy',
        value: {
          precision: this.determinePrecision(objective),
          units: this.extractUnits(objective)
        },
        errorMessage: 'Check your calculation and units'
      },
      {
        type: 'completion',
        value: {
          minimumSteps: this.calculateMinimumSteps(objective)
        },
        errorMessage: 'Please complete all parts of the question'
      }
    ];

    // Add specific criteria based on mathematical domain
    if (objective.description.toLowerCase().includes('problem solving')) {
      criteria.push({
        type: 'strategy',
        value: ['identify', 'plan', 'execute', 'verify'],
        errorMessage: 'Show your problem-solving strategy'
      });
    }

    return criteria;
  }

  private generateEnglishCriteria(objective: LearningObjective): ValidationRule[] {
    const criteria: ValidationRule[] = [
      {
        type: 'grammar',
        value: {
          punctuation: true,
          spelling: true,
          sentenceStructure: true
        },
        errorMessage: 'Check your grammar and spelling'
      },
      {
        type: 'content',
        value: {
          relevance: true,
          coherence: true,
          development: true
        },
        errorMessage: 'Ensure your answer is relevant and well-developed'
      }
    ];

    // Add specific criteria based on English domain
    if (objective.description.toLowerCase().includes('comprehension')) {
      criteria.push({
        type: 'comprehension',
        value: ['evidence', 'inference', 'analysis'],
        errorMessage: 'Support your answer with evidence from the text'
      });
    }

    return criteria;
  }

  private extractRequiredSteps(objective: LearningObjective): string[] {
    // Extract required mathematical steps from objective
    const steps: string[] = [];
    const description = objective.description.toLowerCase();

    if (description.includes('solve')) steps.push('equation-setup', 'calculation');
    if (description.includes('explain')) steps.push('explanation');
    if (description.includes('prove')) steps.push('proof');
    if (description.includes('draw')) steps.push('diagram');

    return steps;
  }

  private determinePrecision(objective: LearningObjective): number {
    // Determine required decimal places or significant figures
    if (objective.description.toLowerCase().includes('decimal')) {
      return 2; // Default to 2 decimal places
    }
    return 0; // Default to whole numbers
  }

  private extractUnits(objective: LearningObjective): string[] {
    // Extract required units from objective
    const units: string[] = [];
    const description = objective.description.toLowerCase();

    if (description.includes('measurement')) {
      units.push('m', 'cm', 'mm', 'kg', 'g', 'l', 'ml');
    }
    if (description.includes('time')) {
      units.push('hours', 'minutes', 'seconds');
    }
    if (description.includes('money')) {
      units.push('£', 'p');
    }

    return units;
  }

  private calculateMinimumSteps(objective: LearningObjective): number {
    // Calculate minimum steps required based on complexity
    let steps = 1;
    const description = objective.description.toLowerCase();

    if (description.includes('multi-step')) steps += 2;
    if (description.includes('explain')) steps += 1;
    if (description.includes('prove')) steps += 2;
    if (description.includes('show working')) steps += 1;

    return steps;
  }
} 