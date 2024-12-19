import { QuestionType, ScaffoldingRule, LearningObjective } from '@/types/curriculum';

export class ScaffoldingSystem {
  private readonly maxHints = 3;
  private readonly hintDelay = 30000; // 30 seconds

  generateScaffolding(
    question: QuestionType,
    objective: LearningObjective,
    previousMistakes: string[]
  ): ScaffoldingRule[] {
    const scaffolding: ScaffoldingRule[] = [];

    // Add conceptual hints
    scaffolding.push(...this.generateConceptualHints(objective));

    // Add procedural hints
    scaffolding.push(...this.generateProceduralHints(question));

    // Add remedial hints based on previous mistakes
    if (previousMistakes.length > 0) {
      scaffolding.push(...this.generateRemedialHints(previousMistakes));
    }

    return this.prioritizeScaffolding(scaffolding);
  }

  private generateConceptualHints(objective: LearningObjective): ScaffoldingRule[] {
    return [
      {
        condition: 'initial',
        hint: `Remember: ${this.simplifyObjective(objective)}`,
        example: this.generateRelatedExample(objective)
      },
      {
        condition: 'after-attempt',
        hint: 'Think about the key concepts we learned',
        nextStep: 'Identify the important information'
      }
    ];
  }

  private generateProceduralHints(question: QuestionType): ScaffoldingRule[] {
    const steps = this.breakDownProblem(question);
    
    return steps.map((step, index) => ({
      condition: `step-${index + 1}`,
      hint: step.hint,
      example: step.example,
      nextStep: steps[index + 1]?.hint
    }));
  }

  private generateRemedialHints(mistakes: string[]): ScaffoldingRule[] {
    return mistakes.map(mistake => ({
      condition: `error-${mistake}`,
      hint: this.getRemedialStrategy(mistake),
      example: this.getRemedialExample(mistake)
    }));
  }

  private breakDownProblem(question: QuestionType): {
    hint: string;
    example?: string;
  }[] {
    const steps = [];
    
    // Read and understand
    steps.push({
      hint: 'First, read the question carefully and identify what you need to find',
      example: 'Underline the key information'
    });

    // Plan approach
    steps.push({
      hint: 'Think about which method you can use to solve this',
      example: 'List the possible approaches'
    });

    // Execute
    steps.push({
      hint: 'Now solve step by step',
      example: 'Show your working out'
    });

    // Check
    steps.push({
      hint: 'Check if your answer makes sense',
      example: 'Try a different method to verify'
    });

    return steps;
  }

  private getRemedialStrategy(mistake: string): string {
    const strategies: { [key: string]: string } = {
      'calculation-error': 'Try using estimation to check if your answer is reasonable',
      'concept-misunderstanding': 'Let\'s review the basic concept first',
      'missing-step': 'Make sure to show all your working out',
      // Add more strategies
    };

    return strategies[mistake] || 'Take your time and check your work';
  }

  private prioritizeScaffolding(scaffolding: ScaffoldingRule[]): ScaffoldingRule[] {
    // Sort hints by priority and relevance
    return scaffolding
      .sort((a, b) => {
        if (a.condition.startsWith('error-')) return -1;
        if (b.condition.startsWith('error-')) return 1;
        return 0;
      })
      .slice(0, this.maxHints);
  }

  private simplifyObjective(objective: LearningObjective): string {
    // Simplify the objective into a student-friendly reminder
    return objective.description
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0)[0];
  }

  private generateRelatedExample(objective: LearningObjective): string {
    // Generate a simpler example of the same concept
    return objective.examples[0] || 'Example not available';
  }
} 