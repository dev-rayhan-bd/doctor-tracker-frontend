'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../services/doctor.service';
import { QueryParams } from '@/types/api';
import { CreateDoctorInput, UpdateDoctorInput } from '@/types/doctor';
import { CreatePatientInput } from '@/types/patient';
import { toast } from 'sonner';

export const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (params?: QueryParams) => [...DOCTOR_KEYS.lists(), params] as const,
  details: () => [...DOCTOR_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...DOCTOR_KEYS.details(), id] as const,
  patients: (id: string) => [...DOCTOR_KEYS.detail(id), 'patients'] as const,
};

export function useDoctors(params?: QueryParams) {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(params),
    queryFn: () => doctorService.getDoctorsClient(params),
  });
}

export function useDoctorDetails(id: string) {
  return useQuery({
    queryKey: DOCTOR_KEYS.detail(id),
    queryFn: () => doctorService.getDoctorByIdClient(id),
    enabled: !!id,
  });
}

export function useDoctorPatients(doctorId: string) {
  return useQuery({
    queryKey: DOCTOR_KEYS.patients(doctorId),
    queryFn: () => doctorService.getDoctorPatients(doctorId),
    enabled: !!doctorId,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorInput) => doctorService.createDoctor(data),
    onSuccess: () => {
      toast.success('Doctor registered successfully');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register doctor');
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoctorInput }) =>
      doctorService.updateDoctor(id, data),
    onSuccess: (_, variables) => {
      toast.success('Doctor updated successfully');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update doctor');
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorService.deleteDoctor(id),
    onSuccess: () => {
      toast.success('Doctor removed successfully');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete doctor');
    },
  });
}

export function useAddPatientToDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      data,
    }: {
      doctorId: string;
      data: Omit<CreatePatientInput, 'doctor'>;
    }) => doctorService.addPatientToDoctor(doctorId, data),
    onSuccess: (_, variables) => {
      toast.success('Patient assigned to doctor successfully');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.patients(variables.doctorId) });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign patient');
    },
  });
}

export function useDeletePatientFromDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      patientId,
    }: {
      doctorId: string;
      patientId: string;
    }) => doctorService.deletePatientFromDoctor(doctorId, patientId),
    onSuccess: (_, variables) => {
      toast.success('Patient removed from doctor roster');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.patients(variables.doctorId) });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove patient');
    },
  });
}
