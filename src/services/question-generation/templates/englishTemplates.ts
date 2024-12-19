import { QuestionTemplate } from '../types';

export const englishTemplates: QuestionTemplate[] = [
  {
    type: 'multipleChoice',
    structure: {
      multipleChoice: {
        stem: "Choose the correct spelling of the word that means '${definition}'",
        options: ['${correct}', '${distractor1}', '${distractor2}', '${distractor3}'],
        correctAnswer: 0,
        explanation: "The correct spelling is '${correct}'. Remember the spelling rule: ${rule}",
        hints: ['Look at the sound patterns', 'Think about similar words you know']
      }
    },
    curriculum: {
      subject: 'english',
      keyStage: 1,
      year: 1,
      term: 1,
      unit: 'Spelling',
      topic: 'Common Exception Words',
      learningObjectives: [
        'spell words containing each of the 40+ phonemes already taught',
        'spell common exception words'
      ]
    },
    difficulty: 'easy'
  },
  // Add more templates based on curriculum
]; 