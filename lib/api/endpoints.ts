export const API_ENDPOINTS = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    verifyOtp: '/users/verify-otp',
    forgotPassword: '/users/forgot-password',
    verifyForgotPasswordOtp: '/users/verify-forgot-password-otp',
    resendOtp: '/users/resend-otp',
    resetPassword: '/users/reset-password',
    changePassword: '/users/change-password',
    me: '/users/me',
    updateProfile: (id: string) => `/users/${id}`,
    refreshToken: '/users/refresh-token',
  },
  doctor: {
    list: '/doctors',
    details: (id: string) => `/doctors/${id}`,
    create: '/doctors',
    update: (id: string) => `/doctors/${id}`,
    delete: (id: string) => `/doctors/${id}`,
    patients: (id: string) => `/doctors/${id}/patients`,
    addPatient: (id: string) => `/doctors/${id}/patients`,
    deletePatient: (doctorId: string, patientId: string) =>
      `/doctors/${doctorId}/patients/${patientId}`,
  },
  patient: {
    list: '/patients',
    details: (id: string) => `/patients/${id}`,
    create: '/patients',
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
  },
} as const;
