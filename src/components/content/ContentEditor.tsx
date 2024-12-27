import React from 'react';
import { QuestionEditor } from '@/components/assessment/QuestionEditor';
import { ContentPreview } from './ContentPreview';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

interface ContentEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
}) => {
  return (
    <Card className="p-4">
      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <QuestionEditor
            question={content}
            onChange={onChange}
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <ContentPreview content={content} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}; 


