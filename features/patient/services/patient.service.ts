import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse, QueryParams } from '@/types/api';
import { Patient, CreatePatientInput, UpdatePatientInput } from '@/types/patient';

export const patientService = {
  async getPatients(params?: QueryParams): Promise<ApiResponse<Patient[]>> {
    const response = await apiClient.get<ApiResponse<Patient[]>>(
      API_ENDPOINTS.patient.list,
      { params },
    );
    return response.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(
      API_ENDPOINTS.patient.details(id),
    );
    return response.data.data;
  },

  async createPatient(payload: CreatePatientInput): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>(
      API_ENDPOINTS.patient.create,
      payload,
    );
    return response.data.data;
  },

  async updatePatient(id: string, payload: UpdatePatientInput): Promise<Patient> {
    const response = await apiClient.patch<ApiResponse<Patient>>(
      API_ENDPOINTS.patient.update(id),
      payload,
    );
    return response.data.data;
  },

  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.patient.delete(id));
  },
};

