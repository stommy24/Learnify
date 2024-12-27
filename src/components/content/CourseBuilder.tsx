import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface CourseBuilderProps {
  sections: Section[];
  onSectionUpdate: (sections: Section[]) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({
  sections,
  onSectionUpdate,
}) => {
  const handleSectionChange = (sectionId: string, type: 'title' | 'content', value: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId ? { ...section, [type]: value } : section
    );
    onSectionUpdate(updatedSections);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="p-4 border rounded-lg">
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Section Title"
            />
            <textarea
              value={section.content}
              onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Section Content"
              rows={4}
            />
          </div>
        ))}
      </div>
    </DndProvider>
  );
}; 
