'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../services/doctor.service';
import { QueryParams } from '@/types/api';
import { Doctor } from '@/types/doctor';
import { toast } from 'sonner';

export const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (params?: QueryParams) => [...DOCTOR_KEYS.lists(), params] as const,
  details: () => [...DOCTOR_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...DOCTOR_KEYS.details(), id] as const,
};

export function useDoctors(params?: QueryParams) {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(params),
    queryFn: () => doctorService.getDoctorsClient(params),
    select: (res) => ({
      doctors: res.data,
      meta: res.meta,
    }),
  });
}

export function useDoctorDetails(id: string) {
  return useQuery({
    queryKey: DOCTOR_KEYS.detail(id),
    queryFn: () => doctorService.getDoctorByIdClient(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Doctor>) => doctorService.createDoctor(data),
    onSuccess: () => {
      toast.success('Doctor created successfully');
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create doctor');
    },
  });
}

