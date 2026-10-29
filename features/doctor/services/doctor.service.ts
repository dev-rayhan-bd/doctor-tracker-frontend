import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse, QueryParams } from '@/types/api';
import { Doctor, CreateDoctorInput, UpdateDoctorInput } from '@/types/doctor';
import { Patient, CreatePatientInput } from '@/types/patient';

export const doctorService = {
  async getDoctorsClient(params?: QueryParams): Promise<ApiResponse<Doctor[]>> {
    const response = await apiClient.get<ApiResponse<Doctor[]>>(
      API_ENDPOINTS.doctor.list,
      { params },
    );
    return response.data;
  },

  async getDoctorByIdClient(id: string): Promise<Doctor> {
    const response = await apiClient.get<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.details(id),
    );
    return response.data.data;
  },

  async createDoctor(payload: CreateDoctorInput): Promise<Doctor> {
    const response = await apiClient.post<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.create,
      payload,
    );
    return response.data.data;
  },

  async updateDoctor(id: string, payload: UpdateDoctorInput): Promise<Doctor> {
    const response = await apiClient.patch<ApiResponse<Doctor>>(
      API_ENDPOINTS.doctor.update(id),
      payload,
    );
    return response.data.data;
  },

  async deleteDoctor(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.doctor.delete(id));
  },

  // Doctor - Patient Relationships
  async getDoctorPatients(id: string): Promise<Patient[]> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.doctor.patients(id),
    );
    const result = response.data?.data;
    if (Array.isArray(result)) {
      return result;
    }
    if (result && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  },

  async addPatientToDoctor(
    doctorId: string,
    payload: Omit<CreatePatientInput, 'doctor'>,
  ): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>(
      API_ENDPOINTS.doctor.addPatient(doctorId),
      payload,
    );
    return response.data.data;
  },

  async deletePatientFromDoctor(
    doctorId: string,
    patientId: string,
  ): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.doctor.deletePatient(doctorId, patientId));
  },
};
