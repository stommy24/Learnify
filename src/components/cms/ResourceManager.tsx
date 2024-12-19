import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Resource } from '../../features/cms/contentSlice';

export const ResourceManager: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Resource['type'] | 'all'>('all');

  const resources = useAppSelector(state => {
    // In a real app, resources would be in their own slice
    return Object.values(state.content.items)
      .flatMap(item => item.resources)
      .filter((resource, index, self) => 
        self.findIndex(r => r.id === resource.id) === index
      );
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Resource Library</h2>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload New Resource
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as Resource['type'] | 'all')}
        >
          <option value="all">All Types</option>
          <option value="video">Videos</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
          <option value="interactive">Interactive</option>
        </select>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onSelect={() => setSelectedResource(resource)}
          />
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <ResourceUploadModal
          onClose={() => setUploadModalOpen(false)}
          onUpload={(resource) => {
            // Handle resource upload
            setUploadModalOpen(false);
          }}
        />
      )}

      {/* Resource Details Modal */}
      {selectedResource && (
        <ResourceDetailsModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

const ResourceCard: React.FC<{
  resource: Resource;
  onSelect: () => void;
}> = ({ resource, onSelect }) => {
  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      {/* Preview */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {resource.type === 'video' && (
          <video src={resource.url} className="object-cover" />
        )}
        {resource.type === 'image' && (
          <img src={resource.url} alt={resource.title} className="object-cover" />
        )}
        {resource.type === 'audio' && (
          <div className="flex items-center justify-center">
            <span className="text-4xl">🎵</span>
          </div>
        )}
        {resource.type === 'document' && (
          <div className="flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
        )}
        {resource.type === 'interactive' && (
          <div className="flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{resource.description}</p>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            resource.type === 'video' ? 'bg-red-100 text-red-800' :
            resource.type === 'image' ? 'bg-green-100 text-green-800' :
            resource.type === 'audio' ? 'bg-yellow-100 text-yellow-800' :
            resource.type === 'document' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {resource.type}
          </span>
          <span className="text-sm text-gray-500">
            {resource.fileSize ? `${(resource.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

const ResourceUploadModal: React.FC<{
  onClose: () => void;
  onUpload: (resource: Resource) => void;
}> = ({ onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image' as Resource['type'],
    file: null as File | null,
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    try {
      // In a real app, this would upload to your storage service
      const url = await mockFileUpload(formData.file);
      
      onUpload({
        id: `resource_${Date.now()}`,
        url,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        tags: formData.tags,
        fileSize: formData.file.size
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Mock file upload - replace with real upload logic
  const mockFileUpload = async (file: File): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Upload New Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              required
              className="mt-1 block w-full"
              onChange={(e) => setFormData({ 
                ...formData, 
                file: e.target.files ? e.target.files[0] : null 
              })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 