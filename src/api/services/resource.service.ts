import { api } from '../interceptors';
import { API_ENDPOINTS } from '../endpoints';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  uploadedAt: string;
}

class ResourceService {
  async getResources(): Promise<Resource[]> {
    const response = await api.get(API_ENDPOINTS.RESOURCE.BASE);
    return response.data;
  }

  async uploadResource(file: File, metadata: Partial<Resource>): Promise<Resource> {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key as keyof Partial<Resource>] as string);
    });

    const response = await api.post(API_ENDPOINTS.RESOURCE.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async downloadResource(resourceId: string): Promise<Blob> {
    const response = await api.get(`${API_ENDPOINTS.RESOURCE.DOWNLOAD}/${resourceId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async deleteResource(resourceId: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.RESOURCE.BASE}/${resourceId}`);
  }
}

export const resourceService = new ResourceService(); 