import { QuestionTemplate } from '../types';

export const mathsTemplates: QuestionTemplate[] = [
  {
    type: 'mathematical',
    structure: {
      mathematical: {
        // Year 1-2 Number and Place Value
        problem: "What is ${num1} ${operator} ${num2}?",
        variables: [
          {
            name: 'num1',
            range: [1, 20],
            step: 1
          },
          {
            name: 'num2',
            range: [1, 20],
            step: 1
          },
          {
            name: 'operator',
            values: ['+', '-']
          }
        ],
        solution: '${num1} ${operator} ${num2}',
        workingSteps: [
          'Read the numbers carefully',
          'Use number line or counters if needed',
          'Write your answer'
        ]
      }
    },
    curriculum: {
      subject: 'mathematics',
      keyStage: 1,
      year: 1,
      term: 1,
      unit: 'Number and Place Value',
      topic: 'Addition and Subtraction',
      learningObjectives: [
        'read, write and interpret mathematical statements involving addition (+), subtraction (−) and equals (=) signs',
        'represent and use number bonds and related subtraction facts within 20'
      ]
    },
    difficulty: 'easy'
  },
  // Add more templates based on curriculum
]; 