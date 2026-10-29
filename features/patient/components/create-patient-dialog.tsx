'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePatient } from '../hooks/use-patients';
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
import { PlusCircle, UserPlus } from 'lucide-react';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(0).max(130),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  doctor: z.string().min(1, 'Please select an assigned doctor'),
  condition: z.enum(['Critical', 'Stable', 'Recovered', 'Under Observation', 'Serious']),
  diagnosis: z.string().optional(),
  status: z.enum(['ACTIVE', 'DISCHARGED']),
});

type PatientFormData = z.infer<typeof patientSchema>;

export function CreatePatientDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createPatient, isPending } = useCreatePatient();
  const { data: doctorsData } = useDoctors({ limit: 100 });
  const doctors = doctorsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: 25,
      gender: 'MALE',
      phone: '',
      email: '',
      doctor: '',
      condition: 'Stable',
      diagnosis: '',
      status: 'ACTIVE',
    },
  });

  const onSubmit = (data: PatientFormData) => {
    createPatient(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
      >
        <PlusCircle className="h-4 w-4" />
        Add Patient
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <UserPlus className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold">Register New Patient</DialogTitle>
            </div>
            <DialogDescription>
              Record patient admission, clinical condition, and assign an attending doctor.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="pt-name">Full Patient Name *</Label>
              <Input id="pt-name" placeholder="Eleanor Vance" {...register('name')} />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pt-age">Age *</Label>
                <Input
                  id="pt-age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pt-gender">Gender *</Label>
                <select
                  id="pt-gender"
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
              <Label htmlFor="pt-doc">Assigned Doctor *</Label>
              <select
                id="pt-doc"
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
              {errors.doctor && <p className="text-xs text-rose-500">{errors.doctor.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pt-phone">Phone Number *</Label>
                <Input id="pt-phone" placeholder="+1 555-0144" {...register('phone')} />
                {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pt-email">Email (Optional)</Label>
                <Input id="pt-email" type="email" placeholder="patient@mail.com" {...register('email')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pt-cond">Clinical Condition *</Label>
                <select
                  id="pt-cond"
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
                <Label htmlFor="pt-status">Admission Status *</Label>
                <select
                  id="pt-status"
                  {...register('status')}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="ACTIVE">Active (In Care)</option>
                  <option value="DISCHARGED">Discharged</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pt-diag">Diagnosis / Health Notes</Label>
              <Input
                id="pt-diag"
                placeholder="Primary symptoms, preliminary diagnosis..."
                {...register('diagnosis')}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? 'Registering...' : 'Register Patient'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
