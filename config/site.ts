export const siteConfig = {
  name: 'Doctor Tracker Portal',
  description: 'Enterprise Doctor and Patient Management Platform',
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    verifyOtp: '/verify-otp',
    forgotPassword: '/forgot-password',
    dashboard: {
      admin: '/dashboard/admin',
      doctor: '/dashboard/doctor',
      patient: '/dashboard/patient',
    },
    doctors: '/doctors',
    appointments: '/appointments',
  },
  roles: {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    PATIENT: 'PATIENT',
  } as const,
};

export type UserRole = (typeof siteConfig.roles)[keyof typeof siteConfig.roles];

