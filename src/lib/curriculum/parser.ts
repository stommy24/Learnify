import { CurriculumStandard, SubjectArea } from '@/types/curriculum';
import * as fs from 'fs';
import * as path from 'path';
import { PDFParser } from 'pdf2json';
import { parseEnglishCurriculum } from './englishParser';
import { parseMathsCurriculum } from './mathsParser';

export class CurriculumParser {
  private static instance: CurriculumParser;
  private curriculumCache: Map<string, CurriculumStandard> = new Map();

  private constructor() {}

  static getInstance(): CurriculumParser {
    if (!CurriculumParser.instance) {
      CurriculumParser.instance = new CurriculumParser();
    }
    return CurriculumParser.instance;
  }

  async parseCurriculum(subject: SubjectArea): Promise<CurriculumStandard[]> {
    const cacheKey = `${subject}-curriculum`;
    
    if (this.curriculumCache.has(cacheKey)) {
      return this.curriculumCache.get(cacheKey)!;
    }

    const pdfPath = path.join(process.cwd(), `${subject}-curriculum.pdf`);
    const pdfData = await this.extractPDFContent(pdfPath);
    
    let curriculum;
    if (subject === 'english') {
      curriculum = await parseEnglishCurriculum(pdfData);
    } else {
      curriculum = await parseMathsCurriculum(pdfData);
    }
    
    this.curriculumCache.set(cacheKey, curriculum);
    return curriculum;
  }

  private async extractPDFContent(pdfPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const content = pdfParser.getRawTextContent();
        resolve(content);
      });

      pdfParser.on("pdfParser_dataError", (error) => {
        reject(error);
      });

      pdfParser.loadPDF(pdfPath);
    });
  }

  public getTopicsByYear(subject: SubjectArea, year: number): CurriculumTopic[] {
    const curriculum = this.curriculumCache.get(`${subject}-curriculum`);
    return curriculum?.find(c => c.year === year)?.topics || [];
  }

  public getObjectivesByTopic(topicId: string): LearningObjective[] {
    // Search through cached curriculum for matching topic
    // Return objectives or empty array if not found
  }
} 