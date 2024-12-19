export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  STUDENT: {
    BASE: '/students',
    PROFILE: '/students/profile',
    GRADES: '/students/grades',
    ASSESSMENTS: '/students/assessments',
    SUBMISSIONS: '/students/submissions',
  },
  TEACHER: {
    BASE: '/teachers',
    PROFILE: '/teachers/profile',
    CLASSES: '/teachers/classes',
    ASSESSMENTS: '/teachers/assessments',
  },
  ASSESSMENT: {
    BASE: '/assessments',
    SUBMISSIONS: '/assessments/submissions',
    GRADES: '/assessments/grades',
  },
  RESOURCE: {
    BASE: '/resources',
    UPLOAD: '/resources/upload',
    DOWNLOAD: '/resources/download',
  },
  COMMUNICATION: {
    MESSAGES: '/communications/messages',
    ANNOUNCEMENTS: '/communications/announcements',
    NOTIFICATIONS: '/communications/notifications',
  },
}; 