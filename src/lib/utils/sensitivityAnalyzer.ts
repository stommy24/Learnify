import { OpenAI } from 'openai';
import { logger } from '@/lib/monitoring';

interface SensitivityAnalysis {
  score: number;
  issues: SensitivityIssue[];
  remediations: Remediation[];
}

interface SensitivityIssue {
  type: SensitivityType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  context: string;
}

interface Remediation {
  issue: string;
  suggestion: string;
  example: string;
}

type SensitivityType = 
  | 'CULTURAL_REFERENCE'
  | 'RELIGIOUS_REFERENCE'
  | 'FAMILY_STRUCTURE'
  | 'ECONOMIC_SITUATION'
  | 'PHYSICAL_ABILITY'
  | 'LEARNING_STYLE'
  | 'DIETARY_REFERENCE';

export class SensitivityAnalyzer {
  private openai: OpenAI;
  private readonly sensitivityPatterns = new Map<SensitivityType, RegExp[]>([
    ['FAMILY_STRUCTURE', [
      /\b(mom|dad|mother|father|parents)\b/i,
      /\b(family|families)\b/i
    ]],
    ['ECONOMIC_SITUATION', [
      /\b(money|cost|expensive|cheap)\b/i,
      /\b(buy|purchase|afford)\b/i
    ]],
    ['DIETARY_REFERENCE', [
      /\b(food|eat|drink|meal)\b/i,
      /\b(restaurant|grocery|store)\b/i
    ]]
  ]);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyze(content: string): Promise<SensitivityAnalysis> {
    try {
      const [basicIssues, aiIssues] = await Promise.all([
        this.detectBasicSensitivityIssues(content),
        this.detectAISensitivityIssues(content)
      ]);

      const allIssues = [...basicIssues, ...aiIssues];
      const score = this.calculateSensitivityScore(allIssues);
      const remediations = await this.generateRemediations(allIssues);

      return {
        score,
        issues: allIssues,
        remediations
      };
    } catch (error) {
      logger.error('Sensitivity analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async detectBasicSensitivityIssues(content: string): Promise<SensitivityIssue[]> {
    const issues: SensitivityIssue[] = [];

    for (const [type, patterns] of this.sensitivityPatterns) {
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          const context = this.getContext(content, matches[0]);
          const severity = this.assessSeverity(type, context);
          
          issues.push({
            type,
            severity,
            description: this.getIssueDescription(type, matches[0]),
            context
          });
        }
      }
    }

    return issues;
  }

  private async detectAISensitivityIssues(content: string): Promise<SensitivityIssue[]> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze the following educational content for cultural sensitivity issues. Consider diverse backgrounds, abilities, and circumstances."
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

  private async generateRemediations(issues: SensitivityIssue[]): Promise<Remediation[]> {
    const remediations: Remediation[] = [];

    for (const issue of issues) {
      const remediation = await this.generateRemediation(issue);
      if (remediation) {
        remediations.push(remediation);
      }
    }

    return remediations;
  }

  private async generateRemediation(issue: SensitivityIssue): Promise<Remediation | null> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate a sensitive and inclusive alternative for the following content issue in educational materials."
      }, {
        role: "user",
        content: JSON.stringify(issue)
      }],
      temperature: 0.7
    });

    const suggestion = response.choices[0].message.content;
    if (!suggestion) return null;

    return {
      issue: issue.description,
      suggestion,
      example: this.generateExample(issue.type, suggestion)
    };
  }

  private calculateSensitivityScore(issues: SensitivityIssue[]): number {
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

  private assessSeverity(type: SensitivityType, context: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    // Implementation of severity assessment based on type and context
    return 'MEDIUM';
  }

  private getIssueDescription(type: SensitivityType, match: string): string {
    const descriptions = {
      FAMILY_STRUCTURE: 'References to family structure may not be inclusive',
      ECONOMIC_SITUATION: 'Content may assume certain economic circumstances',
      DIETARY_REFERENCE: 'Food references may not consider all dietary restrictions'
    };

    return descriptions[type] || `Potential sensitivity issue with: ${match}`;
  }

  private generateExample(type: SensitivityType, suggestion: string): string {
    // Implementation of example generation based on type and suggestion
    return suggestion;
  }
}

export const sensitivityAnalyzer = new SensitivityAnalyzer(); 