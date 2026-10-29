'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Patient } from '@/types/patient';
import { useUpdatePatient } from '../hooks/use-patients';
import { useDoctors } from '@/features/doctor/hooks/use-doctors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

const editSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(0).max(130),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  doctor: z.string().min(1, 'Doctor is required'),
  condition: z.enum(['Critical', 'Stable', 'Recovered', 'Under Observation', 'Serious']),
  diagnosis: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISCHARGED']),
});

type EditPatientFormData = z.infer<typeof editSchema>;

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
}: {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: updatePatient, isPending } = useUpdatePatient();
  const { data: doctorsData } = useDoctors({ limit: 100 });
  const doctors = doctorsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPatientFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (patient) {
      const docId = typeof patient.doctor === 'object' ? patient.doctor._id : patient.doctor;
      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || '',
        doctor: docId || '',
        condition: patient.condition,
        diagnosis: patient.diagnosis || '',
        status: patient.status,
      });
    }
  }, [patient, reset]);

  if (!patient) return null;

  const onSubmit = (data: EditPatientFormData) => {
    updatePatient(
      { id: patient._id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Edit className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">Edit Patient Record</DialogTitle>
          </div>
          <DialogDescription>
            Update clinical diagnosis, attending specialist, or admission status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Full Patient Name *</Label>
            <Input id="edit-name" {...register('name')} />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-age">Age *</Label>
              <Input
                id="edit-age"
                type="number"
                {...register('age', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-gender">Gender *</Label>
              <select
                id="edit-gender"
                {...register('gender')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-doc">Assigned Doctor *</Label>
            <select
              id="edit-doc"
              {...register('doctor')}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium"
            >
              <option value="">Select a Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} - {doc.specialization} ({doc.hospital})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input id="edit-phone" {...register('phone')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email (Optional)</Label>
              <Input id="edit-email" type="email" {...register('email')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cond">Clinical Condition *</Label>
              <select
                id="edit-cond"
                {...register('condition')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium"
              >
                <option value="Stable">Stable</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Serious">Serious</option>
                <option value="Critical">Critical</option>
                <option value="Recovered">Recovered</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-status">Status *</Label>
              <select
                id="edit-status"
                {...register('status')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="ACTIVE">Active (In Care)</option>
                <option value="DISCHARGED">Discharged</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-diag">Diagnosis / Health Notes</Label>
            <Input id="edit-diag" {...register('diagnosis')} />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
