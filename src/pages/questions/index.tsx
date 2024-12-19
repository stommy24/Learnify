import { useState } from 'react';
import { useRouter } from 'next/router';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { QuestionTable } from '@/components/questions/QuestionTable';
import { QuestionSearch } from '@/components/questions/QuestionSearch';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { Question } from '@/services/question-generation/types';
import { useQuestions } from '@/hooks/useQuestions';

export default function QuestionsListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    questions,
    isLoading,
    error,
    pagination,
    setPagination
  } = useQuestions({ filters, searchQuery });

  const handleGenerateNew = () => {
    router.push('/questions/generate');
  };

  const handleExport = async (selectedIds: string[]) => {
    // Implement export logic
  };

  const handleImport = async (file: File) => {
    // Implement import logic
  };

  if (error) {
    return <div>Error loading questions: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Questions Library</h1>
        <div className="space-x-2">
          <Button onClick={handleGenerateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <QuestionFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="space-y-4">
          <QuestionSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <QuestionTable
            questions={questions}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      </div>
    </div>
  );
} 