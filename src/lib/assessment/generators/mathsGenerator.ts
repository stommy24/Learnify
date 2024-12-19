import { QuestionVariable, ValidationRule } from '@/types/curriculum';

export class MathsGenerator {
  generateNumber(variable: QuestionVariable, level: number): number {
    const { range, constraints = [] } = variable;
    let min = range?.min ?? 0;
    let max = range?.max ?? 100;

    // Adjust difficulty based on level
    if (constraints.includes('level-adjusted')) {
      min *= level;
      max *= level;
    }

    // Generate number within range
    let number = Math.floor(Math.random() * (max - min + 1)) + min;

    // Apply additional constraints
    if (constraints.includes('even')) {
      number = Math.floor(number / 2) * 2;
    } else if (constraints.includes('odd')) {
      number = Math.floor(number / 2) * 2 + 1;
    } else if (constraints.includes('multiple')) {
      const base = parseInt(constraints.find(c => c.startsWith('multiple-'))?.split('-')[1] || '1');
      number = Math.floor(number / base) * base;
    }

    return number;
  }

  generateFraction(constraints: string[]): { numerator: number; denominator: number } {
    let numerator: number;
    let denominator: number;

    if (constraints.includes('proper')) {
      denominator = this.generateNumber({ type: 'number', range: { min: 2, max: 12 } }, 1);
      numerator = this.generateNumber({ type: 'number', range: { min: 1, max: denominator - 1 } }, 1);
    } else {
      denominator = this.generateNumber({ type: 'number', range: { min: 2, max: 12 } }, 1);
      numerator = this.generateNumber({ type: 'number', range: { min: 1, max: denominator * 2 } }, 1);
    }

    if (constraints.includes('reducible')) {
      // Ensure the fraction can be reduced
      numerator *= 2;
      denominator *= 2;
    }

    return { numerator, denominator };
  }

  generateEquation(level: number): { equation: string; solution: number } {
    const operations = level < 3 ? ['+', '-'] : ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const num1 = this.generateNumber({ type: 'number', range: { min: 1, max: 10 * level } }, level);
    const num2 = this.generateNumber({ type: 'number', range: { min: 1, max: 10 * level } }, level);
    
    let solution: number;
    let equation: string;

    switch (operation) {
      case '+':
        solution = num1 + num2;
        equation = `${num1} + ${num2}`;
        break;
      case '-':
        solution = num1 - num2;
        equation = `${num1} - ${num2}`;
        break;
      case '*':
        solution = num1 * num2;
        equation = `${num1} × ${num2}`;
        break;
      case '/':
        // Ensure division results in whole number
        solution = num2;
        equation = `${num1 * num2} ÷ ${num1}`;
        break;
      default:
        solution = num1 + num2;
        equation = `${num1} + ${num2}`;
    }

    return { equation, solution };
  }

  validateAnswer(answer: number, rules: ValidationRule[]): { isValid: boolean; feedback: string } {
    for (const rule of rules) {
      switch (rule.type) {
        case 'range':
          if (answer < rule.value.min || answer > rule.value.max) {
            return { isValid: false, feedback: rule.errorMessage };
          }
          break;
        case 'exact':
          if (answer !== rule.value) {
            return { isValid: false, feedback: rule.errorMessage };
          }
          break;
        case 'method':
          // Validate solution method (e.g., for multi-step problems)
          break;
      }
    }

    return { isValid: true, feedback: 'Correct!' };
  }
} 