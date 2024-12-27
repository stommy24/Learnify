import React, { useState } from 'react';
import { Resource } from '../../features/cms/contentSlice';
import { useAppSelector } from '../../app/hooks';

interface ResourceSelectorProps {
  selectedResources: Resource[];
  onResourcesChange: (resources: Resource[]) => void;
}

export const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  selectedResources,
  onResourcesChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Resource['type'] | 'all'>('all');

  // In a real app, resources would be in their own slice
  const allResources = useAppSelector(state => {
    return Object.values(state.content.items)
      .flatMap(item => item.resources)
      .filter((resource, index, self) => 
        self.findIndex(r => r.id === resource.id) === index
      );
  });

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleToggleResource = (resource: Resource) => {
    const isSelected = selectedResources.some(r => r.id === resource.id);
    if (isSelected) {
      onResourcesChange(selectedResources.filter(r => r.id !== resource.id));
    } else {
      onResourcesChange([...selectedResources, resource]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resources</h3>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

      {/* Selected Resources */}
      {selectedResources.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Resources</h4>
          <div className="flex flex-wrap gap-2">
            {selectedResources.map(resource => (
              <div
                key={resource.id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
              >
                <span>{resource.title}</span>
                <button
                  onClick={() => handleToggleResource(resource)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedResources.some(r => r.id === resource.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleToggleResource(resource)}
          >
            <div className="flex items-start gap-3">
              {/* Resource Type Icon */}
              <div className={`p-2 rounded-lg ${
                resource.type === 'video' ? 'bg-red-100 text-red-600' :
                resource.type === 'image' ? 'bg-green-100 text-green-600' :
                resource.type === 'audio' ? 'bg-yellow-100 text-yellow-600' :
                resource.type === 'document' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {resource.type === 'video' ? '🎥' :
                 resource.type === 'image' ? '🖼️' :
                 resource.type === 'audio' ? '🎵' :
                 resource.type === 'document' ? '📄' : '🎮'}
              </div>

              {/* Resource Info */}
              <div className="flex-grow">
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {resource.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
