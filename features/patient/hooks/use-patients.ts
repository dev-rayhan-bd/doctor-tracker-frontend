'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patient.service';
import { QueryParams } from '@/types/api';
import { CreatePatientInput, UpdatePatientInput } from '@/types/patient';
import { toast } from 'sonner';

export const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params?: QueryParams) => [...PATIENT_KEYS.lists(), params] as const,
  details: () => [...PATIENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PATIENT_KEYS.details(), id] as const,
};

export function usePatients(params?: QueryParams) {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params),
    queryFn: () => patientService.getPatients(params),
  });
}

export function usePatientDetails(id: string) {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(id),
    queryFn: () => patientService.getPatientById(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientInput) => patientService.createPatient(data),
    onSuccess: () => {
      toast.success('Patient registered successfully');
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register patient');
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientInput }) =>
      patientService.updatePatient(id, data),
    onSuccess: (_, variables) => {
      toast.success('Patient record updated');
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(variables.id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update patient');
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      toast.success('Patient removed successfully');
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete patient');
    },
  });
}

