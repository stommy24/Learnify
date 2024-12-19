import { LearningStyleMapping, QuestionType } from '@/types/curriculum';

export class LearningStyleAdapter {
  adaptQuestion(
    question: QuestionType,
    learningStyle: keyof LearningStyleMapping
  ): QuestionType {
    const adapted = { ...question };

    switch (learningStyle) {
      case 'visual':
        adapted.template = this.addVisualElements(question.template);
        break;
      case 'auditory':
        adapted.template = this.addAuditoryElements(question.template);
        break;
      case 'kinesthetic':
        adapted.template = this.addKinestheticElements(question.template);
        break;
      case 'readingWriting':
        adapted.template = this.addTextualElements(question.template);
        break;
    }

    return adapted;
  }

  private addVisualElements(template: string): string {
    return `
      [Visual Aid Available]
      ${template}
      
      You can:
      • View diagrams by clicking the "Show Diagram" button
      • Use the visual workspace for solving
      • Toggle color-coding for important information
    `;
  }

  private addAuditoryElements(template: string): string {
    return `
      [Audio Available]
      ${template}
      
      You can:
      • Click to hear the question read aloud
      • Record your verbal response
      • Use voice commands for navigation
    `;
  }

  private addKinestheticElements(template: string): string {
    return `
      [Interactive Elements Available]
      ${template}
      
      You can:
      • Drag and drop elements to solve
      • Use the virtual manipulatives
      • Draw your solution on the tablet
    `;
  }

  private addTextualElements(template: string): string {
    return `
      ${template}
      
      Additional Resources:
      • Written explanation available
      • Step-by-step written guide
      • Note-taking space provided
    `;
  }

  getAdaptationResources(learningStyle: keyof LearningStyleMapping): string[] {
    switch (learningStyle) {
      case 'visual':
        return [
          'diagrams',
          'charts',
          'color-coding',
          'mind-maps',
          'visual-workspace'
        ];
      case 'auditory':
        return [
          'text-to-speech',
          'voice-recording',
          'audio-instructions',
          'verbal-feedback'
        ];
      case 'kinesthetic':
        return [
          'interactive-manipulatives',
          'drawing-tools',
          'drag-drop-interface',
          'gesture-controls'
        ];
      case 'readingWriting':
        return [
          'written-explanations',
          'note-templates',
          'writing-prompts',
          'text-highlights'
        ];
    }
  }
} 