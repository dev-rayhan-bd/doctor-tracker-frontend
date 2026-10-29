'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateDoctor } from '../hooks/use-doctors';
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
import { PlusCircle, Stethoscope } from 'lucide-react';

const doctorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  hospital: z.string().min(2, 'Hospital name is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

export function CreateDoctorDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createDoctor, isPending } = useCreateDoctor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
      status: 'ACTIVE',
    },
  });

  const onSubmit = (data: DoctorFormData) => {
    createDoctor(data, {
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
        Add Doctor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Stethoscope className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold">Register New Doctor</DialogTitle>
            </div>
            <DialogDescription>
              Enter the specialist&apos;s details to onboard them into the clinic system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="doc-name">Full Name *</Label>
              <Input
                id="doc-name"
                placeholder="Dr. Sarah Jenkins"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="doc-spec">Specialization *</Label>
                <Input
                  id="doc-spec"
                  placeholder="Cardiology"
                  {...register('specialization')}
                  aria-invalid={!!errors.specialization}
                />
                {errors.specialization && (
                  <p className="text-xs text-rose-500">{errors.specialization.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-hosp">Hospital / Clinic *</Label>
                <Input
                  id="doc-hosp"
                  placeholder="Metro Central Hospital"
                  {...register('hospital')}
                  aria-invalid={!!errors.hospital}
                />
                {errors.hospital && (
                  <p className="text-xs text-rose-500">{errors.hospital.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="doc-phone">Phone Number *</Label>
                <Input
                  id="doc-phone"
                  placeholder="+1 555-0199"
                  {...register('phone')}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-email">Email Address *</Label>
                <Input
                  id="doc-email"
                  type="email"
                  placeholder="s.jenkins@hospital.org"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500">{errors.email.message}</p>
                )}
              </div>
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
                {isPending ? 'Registering...' : 'Register Doctor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
