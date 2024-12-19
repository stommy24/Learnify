import { CurriculumStandard, LearningObjective, CurriculumTopic } from '@/types/curriculum';

export async function parseEnglishCurriculum(pdfContent: string): Promise<CurriculumStandard[]> {
  const curriculum: CurriculumStandard[] = [];
  
  // Split content into key stages
  const keyStageRegex = /Key stage (\d)/g;
  const keyStageBlocks = pdfContent.split(keyStageRegex);

  for (let i = 1; i < keyStageBlocks.length; i += 2) {
    const keyStage = parseInt(keyStageBlocks[i]);
    const content = keyStageBlocks[i + 1];

    // Parse year groups within key stage
    const yearGroups = parseYearGroups(content, keyStage);
    curriculum.push(...yearGroups);
  }

  return curriculum;
}

function parseYearGroups(content: string, keyStage: number): CurriculumStandard[] {
  const standards: CurriculumStandard[] = [];
  const yearRegex = /Year (\d)/g;
  const yearBlocks = content.split(yearRegex);

  for (let i = 1; i < yearBlocks.length; i += 2) {
    const year = parseInt(yearBlocks[i]);
    const yearContent = yearBlocks[i + 1];

    standards.push({
      subject: 'english',
      keyStage,
      year,
      topics: parseTopics(yearContent, year)
    });
  }

  return standards;
}

function parseTopics(content: string, year: number): CurriculumTopic[] {
  const topics: CurriculumTopic[] = [];
  const strands = ['Reading', 'Writing', 'Spoken Language'];

  for (const strand of strands) {
    const strandRegex = new RegExp(`${strand}[\\s\\S]*?(?=(?:${strands.join('|')})|$)`);
    const strandMatch = content.match(strandRegex);
    
    if (strandMatch) {
      const objectives = parseObjectives(strandMatch[0], strand);
      
      topics.push({
        id: `english-${year}-${strand.toLowerCase().replace(' ', '-')}`,
        name: strand,
        strand,
        objectives,
        prerequisites: generatePrerequisites(strand, year),
        difficulty: calculateDifficulty(year, strand),
        ageRange: {
          min: year + 4, // UK system: Year 1 starts at age 5
          max: year + 5
        }
      });
    }
  }

  return topics;
}

function parseObjectives(content: string, strand: string): LearningObjective[] {
  const objectives: LearningObjective[] = [];
  const bulletPoints = content.match(/•[^•]+/g) || [];

  bulletPoints.forEach((point, index) => {
    objectives.push({
      id: `${strand.toLowerCase()}-obj-${index}`,
      description: point.replace('•', '').trim(),
      examples: extractExamples(point),
      questionTypes: generateQuestionTypes(strand, point),
      learningStyles: generateLearningStyleMapping(strand, point),
      assessmentCriteria: generateAssessmentCriteria(point)
    });
  });

  return objectives;
} 