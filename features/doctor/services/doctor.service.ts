import { apiClient } from '@/lib/api/client';
import { serverFetch } from '@/lib/api/server-fetch';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse, QueryParams } from '@/types/api';
import { Doctor } from '@/types/doctor';

export const doctorService = {
  // SSR / SSG (Server Components)
  async getDoctorsServer(params?: QueryParams, revalidate: number | false = 60) {
    return serverFetch<Doctor[]>(API_ENDPOINTS.doctor.list, {
      params,
      revalidate,
      tags: ['doctors'],
    });
  },

  async getDoctorByIdServer(id: string, revalidate: number | false = 60) {
    return serverFetch<Doctor>(API_ENDPOINTS.doctor.details(id), {
      revalidate,
      tags: [`doctor-${id}`],
    });
  },

  // Client Components (TanStack Query / Mutations)
  async getDoctorsClient(params?: QueryParams): Promise<ApiResponse<Doctor[]>> {
    const response = await apiClient.get<ApiResponse<Doctor[]>>(
      API_ENDPOINTS.doctor.list,
      { params },
    );
    return response.data;
  },

  async getDoctorByIdClient(id: string): Promise<ApiResponse<Doctor>> {
    const response = await apiClient.get<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.details(id),
    );
    return response.data;
  },

  async createDoctor(payload: Partial<Doctor>): Promise<Doctor> {
    const response = await apiClient.post<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.create,
      payload,
    );
    return response.data.data;
  },

  async updateDoctor(id: string, payload: Partial<Doctor>): Promise<Doctor> {
    const response = await apiClient.patch<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.update(id),
      payload,
    );
    return response.data.data;
  },
};

