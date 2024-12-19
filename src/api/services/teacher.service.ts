import { api } from '../interceptors';
import { API_ENDPOINTS } from '../endpoints';

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  classes: string[];
}

class TeacherService {
  async getProfile(): Promise<TeacherProfile> {
    const response = await api.get(API_ENDPOINTS.TEACHER.PROFILE);
    return response.data;
  }

  async updateProfile(data: Partial<TeacherProfile>): Promise<TeacherProfile> {
    const response = await api.put(API_ENDPOINTS.TEACHER.PROFILE, data);
    return response.data;
  }

  async getClasses(): Promise<any[]> {
    const response = await api.get(API_ENDPOINTS.TEACHER.CLASSES);
    return response.data;
  }

  async createAssessment(data: any): Promise<any> {
    const response = await api.post(API_ENDPOINTS.TEACHER.ASSESSMENTS, data);
    return response.data;
  }

  async gradeSubmission(submissionId: string, grade: number, feedback: string): Promise<void> {
    await api.post(`${API_ENDPOINTS.ASSESSMENT.GRADES}/${submissionId}`, { grade, feedback });
  }
}

export const teacherService = new TeacherService(); 