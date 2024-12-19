import { Question } from '@/types';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export async function exportQuestions(questions: Question[]) {
  // CSV Export
  const csvData = questions.map(q => ({
    id: q.id,
    content: q.content,
    answer: q.answer,
    type: q.type,
    difficulty: q.metadata.difficulty,
    subject: q.metadata.curriculum.subject,
    keyStage: q.metadata.curriculum.keyStage,
    year: q.metadata.curriculum.year,
    topic: q.metadata.curriculum.topic
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `questions_export_${new Date().toISOString()}.csv`);
}

export async function importQuestions(file: File): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const questions = results.data.map(row => ({
            // Convert CSV row back to Question type
            // Add validation and error handling
          }));
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
} 