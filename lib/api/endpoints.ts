export const API_ENDPOINTS = {
  auth: {
    login: '/user/login',
    register: '/user/register',
    verifyOtp: '/user/verify-otp',
    forgotPassword: '/user/forgot-password',
    resetPassword: '/user/reset-password',
    me: '/user/me',
    refreshToken: '/user/refresh-token',
  },
  doctor: {
    list: '/doctor',
    details: (id: string) => `/doctor/${id}`,
    create: '/doctor',
    update: (id: string) => `/doctor/${id}`,
    delete: (id: string) => `/doctor/${id}`,
    schedule: (id: string) => `/doctor/${id}/schedule`,
  },
  patient: {
    list: '/patient',
    details: (id: string) => `/patient/${id}`,
    create: '/patient',
    update: (id: string) => `/patient/${id}`,
    delete: (id: string) => `/patient/${id}`,
  },
  analytics: {
    overview: '/analytics/overview',
    stats: '/analytics/stats',
  },
} as const;

