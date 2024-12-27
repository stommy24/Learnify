import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ContentList } from './ContentList';
import { ContentEditor } from './ContentEditor';
import { ResourceManager } from './ResourceManager';
import { setFilters } from '../../features/cms/contentSlice';

export const ContentManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, selectedItem } = useAppSelector(state => state.content);
  const [view, setView] = useState<'list' | 'editor' | 'resources'>('list');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Content List
            </button>
            <button
              onClick={() => setView('editor')}
              className={`px-4 py-2 rounded-md ${
                view === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setView('resources')}
              className={`px-4 py-2 rounded-md ${
                view === 'resources'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Resources
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="form-select rounded-md border-gray-300"
              onChange={(e) => dispatch(setFilters({
                ...filters,
                subject: e.target.value
              }))}
              value={filters.subject}
            >
              <option value="">All Subjects</option>
              <option value="english">English</option>
              <option value="mathematics">Mathematics</option>
            </select>

            <select
              className="form-select rounded-md border-gray-300"
              onChange={(e) => dispatch(setFilters({
                ...filters,
                yearGroup: parseInt(e.target.value)
              }))}
              value={filters.yearGroup}
            >
              <option value="">All Year Groups</option>
              {[1, 2, 3, 4, 5, 6].map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>

            <select
              className="form-select rounded-md border-gray-300"
              onChange={(e) => dispatch(setFilters({
                ...filters,
                type: e.target.value
              }))}
              value={filters.type}
            >
              <option value="">All Types</option>
              <option value="lesson">Lessons</option>
              <option value="exercise">Exercises</option>
              <option value="assessment">Assessments</option>
            </select>

            <select
              className="form-select rounded-md border-gray-300"
              onChange={(e) => dispatch(setFilters({
                ...filters,
                status: e.target.value
              }))}
              value={filters.status}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow">
          {view === 'list' && <ContentList />}
          {view === 'editor' && <ContentEditor />}
          {view === 'resources' && <ResourceManager />}
        </div>
      </div>
    </div>
  );
}; 
