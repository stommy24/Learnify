import React, { useState } from 'react';
import { Resource } from '../../features/cms/contentSlice';

interface ResourceDetailsModalProps {
  resource: Resource;
  onClose: () => void;
}

export const ResourceDetailsModal: React.FC<ResourceDetailsModalProps> = ({
  resource,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState(resource);

  const handleSave = async () => {
    try {
      // In a real app, this would update the resource in your backend
      // await updateResource(editedResource);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update resource:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Resource Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6">
          {resource.type === 'video' && (
            <video
              src={resource.url}
              controls
              className="w-full rounded-lg"
            />
          )}
          {resource.type === 'image' && (
            <img
              src={resource.url}
              alt={resource.title}
              className="w-full rounded-lg"
            />
          )}
          {resource.type === 'audio' && (
            <audio
              src={resource.url}
              controls
              className="w-full"
            />
          )}
          {resource.type === 'document' && (
            <iframe
              src={resource.url}
              className="w-full h-96 rounded-lg border"
            />
          )}
          {resource.type === 'interactive' && (
            <div className="w-full h-96 rounded-lg border flex items-center justify-center bg-gray-50">
              <p>Interactive Content Preview</p>
            </div>
          )}
        </div>

        {/* Details */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editedResource.title}
                onChange={(e) => setEditedResource({
                  ...editedResource,
                  title: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={editedResource.description}
                onChange={(e) => setEditedResource({
                  ...editedResource,
                  description: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editedResource.tags.join(', ')}
                onChange={(e) => setEditedResource({
                  ...editedResource,
                  tags: e.target.value.split(',').map(tag => tag.trim())
                })}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Title</h3>
              <p className="mt-1">{resource.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="mt-1">{resource.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Type</h3>
              <span className={`mt-1 inline-block px-2 py-1 text-sm rounded-full ${
                resource.type === 'video' ? 'bg-red-100 text-red-800' :
                resource.type === 'image' ? 'bg-green-100 text-green-800' :
                resource.type === 'audio' ? 'bg-yellow-100 text-yellow-800' :
                resource.type === 'document' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {resource.type}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Tags</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
              <a
                href={resource.url}
                download
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Download
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 