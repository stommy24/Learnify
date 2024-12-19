interface ParsedResponse {
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints: string[];
  metadata: {
    difficulty: number;
    estimatedTime: number;
    skillsTested: string[];
    curriculumAlignment: string[];
  };
}

export class AIResponseParser {
  static parse(response: string): ParsedResponse {
    // Split response into sections
    const sections = response.split('\n\n');
    
    // Extract question
    const question = sections.find(s => 
      s.toLowerCase().includes('question:'))
      ?.replace('Question:', '')
      .trim() || '';

    // Extract options for multiple choice
    const options = sections.find(s => 
      s.toLowerCase().includes('options:'))
      ?.split('\n')
      .filter(line => line.match(/^[A-D]\)/))
      .map(line => line.replace(/^[A-D]\)/, '').trim());

    // Extract correct answer
    const correctAnswer = sections.find(s => 
      s.toLowerCase().includes('correct answer:'))
      ?.replace('Correct Answer:', '')
      .trim() || '';

    // Extract explanation
    const explanation = sections.find(s => 
      s.toLowerCase().includes('explanation:'))
      ?.replace('Explanation:', '')
      .trim() || '';

    // Extract hints
    const hints = sections.find(s => 
      s.toLowerCase().includes('hints:'))
      ?.split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\./, '').trim()) || [];

    // Extract metadata
    const metadata = this.parseMetadata(
      sections.find(s => s.toLowerCase().includes('metadata:')) || ''
    );

    return {
      question,
      options,
      correctAnswer,
      explanation,
      hints,
      metadata
    };
  }

  private static parseMetadata(metadataSection: string): {
    difficulty: number;
    estimatedTime: number;
    skillsTested: string[];
    curriculumAlignment: string[];
  } {
    const difficulty = Number(
      metadataSection.match(/Difficulty:\s*(\d+)/)?.[1]
    ) || 3;

    const estimatedTime = Number(
      metadataSection.match(/Estimated Time:\s*(\d+)/)?.[1]
    ) || 60;

    const skillsTested = metadataSection
      .match(/Skills Tested:\s*(.+)/)?.[1]
      .split(',')
      .map(s => s.trim()) || [];

    const curriculumAlignment = metadataSection
      .match(/Curriculum Alignment:\s*(.+)/)?.[1]
      .split(',')
      .map(s => s.trim()) || [];

    return {
      difficulty,
      estimatedTime,
      skillsTested,
      curriculumAlignment
    };
  }
} 