import { OpenAI } from 'openai';
import { logger } from '@/lib/monitoring';

interface BiasAnalysis {
  score: number;
  issues: BiasIssue[];
  suggestions: string[];
}

interface BiasIssue {
  type: BiasType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  context: string;
}

type BiasType = 
  | 'GENDER'
  | 'CULTURAL'
  | 'RACIAL'
  | 'SOCIOECONOMIC'
  | 'ABILITY'
  | 'AGE'
  | 'GEOGRAPHIC';

export class BiasDetector {
  private openai: OpenAI;
  private readonly biasPatterns = new Map<BiasType, RegExp[]>([
    ['GENDER', [
      /\b(he|his|him|she|her|hers)\b/i,
      /\b(businessman|businesswoman|chairman|chairwoman)\b/i,
      /\b(policeman|policewoman|fireman|firewoman)\b/i
    ]],
    ['CULTURAL', [
      /\b(normal|typical|standard)\s+(culture|tradition|practice)\b/i,
      /\b(exotic|primitive|unusual)\s+(culture|tradition|practice)\b/i
    ]],
    ['SOCIOECONOMIC', [
      /\b(poor|rich|wealthy|privileged)\b/i,
      /\b(luxury|basic|essential)\s+(items?|goods?)\b/i
    ]]
  ]);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyze(content: string): Promise<BiasAnalysis> {
    try {
      const [basicIssues, aiIssues] = await Promise.all([
        this.detectBasicBias(content),
        this.detectAIBias(content)
      ]);

      const allIssues = [...basicIssues, ...aiIssues];
      const score = this.calculateBiasScore(allIssues);
      const suggestions = this.generateSuggestions(allIssues);

      return {
        score,
        issues: allIssues,
        suggestions
      };
    } catch (error) {
      logger.error('Bias detection failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async detectBasicBias(content: string): Promise<BiasIssue[]> {
    const issues: BiasIssue[] = [];

    for (const [type, patterns] of this.biasPatterns) {
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          issues.push({
            type,
            severity: 'MEDIUM',
            description: `Potentially biased language detected: ${matches[0]}`,
            context: this.getContext(content, matches[0])
          });
        }
      }
    }

    return issues;
  }

  private async detectAIBias(content: string): Promise<BiasIssue[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze the following content for potential bias in educational materials for children. Focus on inclusivity and fairness."
      }, {
        role: "user",
        content
      }],
      temperature: 0.1
    });

    const analysis = JSON.parse(response.choices[0].message.content || '[]');
    return analysis.map((issue: any) => ({
      type: issue.type,
      severity: issue.severity,
      description: issue.description,
      context: issue.context
    }));
  }

  private calculateBiasScore(issues: BiasIssue[]): number {
    if (issues.length === 0) return 1;

    const severityWeights = {
      LOW: 0.1,
      MEDIUM: 0.3,
      HIGH: 0.5
    };

    const totalDeduction = issues.reduce(
      (sum, issue) => sum + severityWeights[issue.severity],
      0
    );

    return Math.max(0, 1 - totalDeduction);
  }

  private getContext(content: string, match: string): string {
    const index = content.indexOf(match);
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + match.length + 50);
    return content.slice(start, end);
  }

  private generateSuggestions(issues: BiasIssue[]): string[] {
    const suggestions = new Set<string>();

    const replacements = {
      GENDER: {
        'businessman': 'business person',
        'policeman': 'police officer',
        'chairman': 'chair',
        'he/she': 'they',
        'his/her': 'their'
      },
      CULTURAL: {
        'normal culture': 'this culture',
        'exotic': 'different',
        'primitive': 'traditional'
      },
      SOCIOECONOMIC: {
        'poor': 'lower-income',
        'rich': 'higher-income',
        'luxury items': 'optional items'
      }
    };

    issues.forEach(issue => {
      if (issue.type in replacements) {
        const typeReplacements = replacements[issue.type as keyof typeof replacements];
        for (const [original, replacement] of Object.entries(typeReplacements)) {
          if (issue.context.includes(original)) {
            suggestions.add(`Consider replacing "${original}" with "${replacement}"`);
          }
        }
      }
    });

    return Array.from(suggestions);
  }
}

export const biasDetector = new BiasDetector(); 