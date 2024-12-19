import { api } from '../interceptors';
import { API_ENDPOINTS } from '../endpoints';

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  yearGroup: number;
  subjects: string[];
}

class StudentService {
  async getProfile(): Promise<StudentProfile> {
    const response = await api.get(API_ENDPOINTS.STUDENT.PROFILE);
    return response.data;
  }

  async updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const response = await api.put(API_ENDPOINTS.STUDENT.PROFILE, data);
    return response.data;
  }

  async getGrades(): Promise<any[]> {
    const response = await api.get(API_ENDPOINTS.STUDENT.GRADES);
    return response.data;
  }

  async getAssessments(): Promise<any[]> {
    const response = await api.get(API_ENDPOINTS.STUDENT.ASSESSMENTS);
    return response.data;
  }

  async submitAssessment(assessmentId: string, answers: any[]): Promise<void> {
    await api.post(`${API_ENDPOINTS.STUDENT.SUBMISSIONS}/${assessmentId}`, { answers });
  }
}

export const studentService = new StudentService(); 