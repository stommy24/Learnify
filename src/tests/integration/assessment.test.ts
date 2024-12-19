import { describe, expect, test } from '@jest/globals';
import { CurriculumParser } from '../../lib/curriculum/parser';
import { QuestionGenerator } from '../../lib/assessment/questionGenerator';
import { ScaffoldingSystem } from '../../lib/assessment/scaffolding/scaffoldingSystem';
import { AssessmentCriteria } from '../../lib/assessment/criteria/assessmentCriteria';
import { LearningStyleAdapter } from '../../lib/assessment/adaptations/learningStyleAdapter';
import { MathsGenerator } from '../../lib/assessment/generators/mathsGenerator';
import { EnglishGenerator } from '../../lib/assessment/generators/englishGenerator';

describe('Assessment System Integration', () => {
  const parser = CurriculumParser.getInstance();
  const questionGenerator = new QuestionGenerator();
  const scaffolding = new ScaffoldingSystem();
  const criteria = new AssessmentCriteria();
  const styleAdapter = new LearningStyleAdapter();
  
  test('Complete maths assessment generation flow', async () => {
    // Load curriculum
    const curriculum = await parser.parseCurriculum('maths');
    expect(curriculum).toBeDefined();
    
    // Get specific topic
    const topic = curriculum[0].topics[0];
    const objective = topic.objectives[0];
    
    // Generate question
    const question = await questionGenerator.generateQuestion(
      topic,
      objective,
      2, // student level
      'visual' // learning style
    );
    
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('variables');
    expect(question).toHaveProperty('validationRules');
  });

  test('Learning style adaptations', async () => {
    const curriculum = await parser.parseCurriculum('english');
    const topic = curriculum[0].topics[0];
    const objective = topic.objectives[0];

    const styles: ('visual' | 'auditory' | 'kinesthetic' | 'readingWriting')[] = 
      ['visual', 'auditory', 'kinesthetic', 'readingWriting'];

    for (const style of styles) {
      const question = await questionGenerator.generateQuestion(
        topic,
        objective,
        2,
        style
      );

      expect(question.adaptations).toBeDefined();
      expect(question.resources).toContain(
        style === 'visual' ? 'diagrams' :
        style === 'auditory' ? 'audio-instructions' :
        style === 'kinesthetic' ? 'interactive-manipulatives' :
        'written-explanations'
      );
    }
  });

  test('Scaffolding progression', async () => {
    const curriculum = await parser.parseCurriculum('maths');
    const topic = curriculum[0].topics[0];
    const objective = topic.objectives[0];

    const scaffoldingRules = scaffolding.generateScaffolding(
      await questionGenerator.generateQuestion(topic, objective, 2, 'visual'),
      objective,
      ['calculation-error']
    );

    expect(scaffoldingRules).toHaveLength(3); // maxHints
    expect(scaffoldingRules[0].condition).toContain('error');
    expect(scaffoldingRules[1].condition).toBe('initial');
  });
}); 