import { serverFetch } from '@/lib/api/server-fetch';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { QueryParams } from '@/types/api';
import { Doctor } from '@/types/doctor';

export const doctorServerService = {
  async getDoctors(params?: QueryParams, revalidate: number | false = 60) {
    return serverFetch<Doctor[]>(API_ENDPOINTS.doctor.list, {
      params,
      revalidate,
      tags: ['doctors'],
    });
  },

  async getDoctorById(id: string, revalidate: number | false = 60) {
    return serverFetch<Doctor>(API_ENDPOINTS.doctor.details(id), {
      revalidate,
      tags: [`doctor-${id}`],
    });
  },
};

