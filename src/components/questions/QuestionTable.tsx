import { useState } from 'react';
import { Question } from '@/types/questions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QuestionTableProps {
  questions: Question[];
  onSelect?: (selectedIds: string[]) => void;
}

export function QuestionTable({ questions, onSelect }: QuestionTableProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    } else {
      setSelectedQuestions(new Set());
    }
    onSelect?.(Array.from(selectedQuestions));
  };

  const handleSelectQuestion = (checked: boolean, questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (checked) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    setSelectedQuestions(newSelected);
    onSelect?.(Array.from(newSelected));
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bronze';
      case 'medium':
        return 'silver';
      case 'hard':
        return 'gold';
      default:
        return 'bronze';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedQuestions.size === questions.length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell>
              <Checkbox
                checked={selectedQuestions.has(question.id)}
                onCheckedChange={(checked: boolean) => 
                  handleSelectQuestion(checked, question.id)
                }
              />
            </TableCell>
            <TableCell>{question.text}</TableCell>
            <TableCell>{question.type}</TableCell>
            <TableCell>
              <Badge variant={getDifficultyVariant(question.difficulty)}>
                {question.difficulty}
              </Badge>
            </TableCell>
            <TableCell>{question.metadata?.subject || '-'}</TableCell>
            <TableCell>{question.metadata?.topic || '-'}</TableCell>
            <TableCell>{question.metadata?.grade || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 