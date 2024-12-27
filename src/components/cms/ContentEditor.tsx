import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addContent, updateContent } from '../../features/cms/contentSlice';
import { ResourceSelector } from './ResourceSelector';
import { QuestionEditor } from './QuestionEditor';
import { Editor } from '@tinymce/tinymce-react';

export const ContentEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedItemId = useAppSelector(state => state.content.selectedItem);
  const selectedItem = useAppSelector(state => 
    selectedItemId ? state.content.items[selectedItemId] : null
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'english',
    yearGroup: 1,
    topic: '',
    subtopic: '',
    type: 'lesson',
    difficulty: 1,
    content: '',
    status: 'draft',
    resources: [],
    questions: []
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contentItem = {
      ...formData,
      id: selectedItemId || `content_${Date.now()}`,
      lastModified: new Date().toISOString(),
      createdBy: 'current_user_id' // This should come from auth context
    };

    if (selectedItemId) {
      dispatch(updateContent({ id: selectedItemId, updates: contentItem }));
    } else {
      dispatch(addContent(contentItem));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          >
            <option value="english">English</option>
            <option value="mathematics">Mathematics</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year Group</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.yearGroup}
            onChange={(e) => setFormData({ ...formData, yearGroup: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 4, 5, 6].map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="lesson">Lesson</option>
            <option value="exercise">Exercise</option>
            <option value="assessment">Assessment</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <Editor
          value={formData.content}
          onEditorChange={(content) => setFormData({ ...formData, content })}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}; 
