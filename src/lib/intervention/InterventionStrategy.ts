interface InterventionPlan {
  studentId: string;
  subject: 'maths' | 'english';
  topic: string;
  strugglingAreas: string[];
  interventions: {
    type: 'practice' | 'concept' | 'prerequisite' | 'alternative';
    description: string;
    resources: string[];
    duration: number; // minutes
    priority: 'high' | 'medium' | 'low';
  }[];
  adaptiveMeasures: {
    difficultyAdjustment: number;
    focusAreas: string[];
    alternativeApproaches: string[];
  };
}

export class InterventionStrategy {
  private static instance: InterventionStrategy;

  static getInstance(): InterventionStrategy {
    if (!InterventionStrategy.instance) {
      InterventionStrategy.instance = new InterventionStrategy();
    }
    return InterventionStrategy.instance;
  }

  async createInterventionPlan(
    studentId: string,
    progress: StudentProgress,
    objective: CurriculumObjective
  ): Promise<InterventionPlan> {
    const strugglingAreas = await this.analyzeStrugglingAreas(
      progress,
      objective
    );

    return {
      studentId,
      subject: objective.subject,
      topic: objective.topic,
      strugglingAreas,
      interventions: this.generateInterventions(
        strugglingAreas,
        objective
      ),
      adaptiveMeasures: this.determineAdaptiveMeasures(
        progress,
        objective
      )
    };
  }

  private async analyzeStrugglingAreas(
    progress: StudentProgress,
    objective: CurriculumObjective
  ): Promise<string[]> {
    const areas: string[] = [];

    // Analyze performance patterns
    if (progress.successRate < 0.6) {
      areas.push('concept_understanding');
    }

    if (progress.timeSpent > objective.weight * 120) {
      areas.push('time_management');
    }

    if (progress.confidence < 0.5) {
      areas.push('confidence');
    }

    // Subject-specific analysis
    if (objective.subject === 'maths') {
      areas.push(...this.analyzeMathsStruggle(progress));
    } else {
      areas.push(...this.analyzeEnglishStruggle(progress));
    }

    return areas;
  }

  private analyzeMathsStruggle(progress: StudentProgress): string[] {
    const areas: string[] = [];
    
    // Analyze common maths issues
    if (progress.attempts > 3 && progress.successRate < 0.5) {
      areas.push('calculation_accuracy');
      areas.push('problem_solving_strategy');
    }

    return areas;
  }

  private analyzeEnglishStruggle(progress: StudentProgress): string[] {
    const areas: string[] = [];
    
    // Analyze common English issues
    if (progress.attempts > 3 && progress.successRate < 0.5) {
      areas.push('comprehension');
      areas.push('vocabulary');
    }

    return areas;
  }

  private generateInterventions(
    strugglingAreas: string[],
    objective: CurriculumObjective
  ): InterventionPlan['interventions'] {
    const interventions: InterventionPlan['interventions'] = [];

    strugglingAreas.forEach(area => {
      const strategies = this.getStrategiesForArea(area, objective);
      interventions.push(...strategies);
    });

    // Sort by priority
    return interventions.sort((a, b) => 
      this.priorityValue(a.priority) - this.priorityValue(b.priority)
    );
  }

  private getStrategiesForArea(
    area: string,
    objective: CurriculumObjective
  ): InterventionPlan['interventions'] {
    const strategies: Record<string, InterventionPlan['interventions']> = {
      concept_understanding: [{
        type: 'concept',
        description: 'Review fundamental concepts with visual aids',
        resources: ['visual_guides', 'interactive_examples'],
        duration: 20,
        priority: 'high'
      }],
      time_management: [{
        type: 'practice',
        description: 'Timed practice exercises with increasing complexity',
        resources: ['practice_sets', 'timer_tools'],
        duration: 15,
        priority: 'medium'
      }],
      confidence: [{
        type: 'practice',
        description: 'Confidence-building exercises with immediate feedback',
        resources: ['positive_reinforcement', 'progress_tracking'],
        duration: 25,
        priority: 'high'
      }],
      calculation_accuracy: [{
        type: 'practice',
        description: 'Step-by-step calculation practice',
        resources: ['calculation_tools', 'worked_examples'],
        duration: 20,
        priority: 'high'
      }],
      comprehension: [{
        type: 'concept',
        description: 'Guided reading and comprehension strategies',
        resources: ['reading_guides', 'comprehension_tools'],
        duration: 30,
        priority: 'high'
      }]
    };

    return strategies[area] || [{
      type: 'alternative',
      description: 'General skill reinforcement',
      resources: ['practice_exercises'],
      duration: 20,
      priority: 'medium'
    }];
  }

  private determineAdaptiveMeasures(
    progress: StudentProgress,
    objective: CurriculumObjective
  ): InterventionPlan['adaptiveMeasures'] {
    return {
      difficultyAdjustment: this.calculateDifficultyAdjustment(progress),
      focusAreas: this.identifyFocusAreas(progress, objective),
      alternativeApproaches: this.suggestAlternativeApproaches(
        progress,
        objective
      )
    };
  }

  private calculateDifficultyAdjustment(
    progress: StudentProgress
  ): number {
    // Calculate difficulty adjustment based on performance
    const baseAdjustment = progress.successRate < 0.3 ? -0.2 :
                          progress.successRate < 0.5 ? -0.1 :
                          progress.successRate > 0.8 ? 0.1 : 0;

    // Consider confidence in adjustment
    return baseAdjustment * (1 + (1 - progress.confidence));
  }

  private identifyFocusAreas(
    progress: StudentProgress,
    objective: CurriculumObjective
  ): string[] {
    // Identify specific areas needing focus
    return progress.strugglingAreas || [];
  }

  private suggestAlternativeApproaches(
    progress: StudentProgress,
    objective: CurriculumObjective
  ): string[] {
    // Suggest different learning approaches
    const approaches = [];
    
    if (progress.confidence < 0.5) {
      approaches.push('visual_learning');
      approaches.push('hands_on_activities');
    }

    if (progress.timeSpent > 100) {
      approaches.push('chunked_learning');
      approaches.push('spaced_repetition');
    }

    return approaches;
  }

  private priorityValue(priority: 'high' | 'medium' | 'low'): number {
    return { high: 0, medium: 1, low: 2 }[priority];
  }
} 