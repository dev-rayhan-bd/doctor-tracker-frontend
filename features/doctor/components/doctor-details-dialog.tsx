'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctor } from '@/types/doctor';
import { PatientCondition } from '@/types/patient';
import {
  useDoctorPatients,
  useAddPatientToDoctor,
  useDeletePatientFromDoctor,
} from '../hooks/use-doctors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserPlus,
  Trash2,
  Stethoscope,
  Building,
  Mail,
  Phone,
  Users,
} from 'lucide-react';

const CONDITION_BADGE_STYLE: Record<PatientCondition, string> = {
  Critical: 'bg-rose-100 text-rose-700 border-rose-200',
  Serious: 'bg-orange-100 text-orange-700 border-orange-200',
  'Under Observation': 'bg-amber-100 text-amber-700 border-amber-200',
  Stable: 'bg-blue-100 text-blue-700 border-blue-200',
  Recovered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const addPatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(0, 'Age must be positive').max(130),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().min(6, 'Valid phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  condition: z.enum(['Critical', 'Stable', 'Recovered', 'Under Observation', 'Serious']),
  diagnosis: z.string().optional(),
});

type AddPatientFormData = z.infer<typeof addPatientSchema>;

export function DoctorDetailsDialog({
  doctor,
  open,
  onOpenChange,
}: {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const doctorId = doctor?._id || '';

  const { data: patients = [], isLoading: isPatientsLoading } = useDoctorPatients(doctorId);
  const { mutate: addPatient, isPending: isAdding } = useAddPatientToDoctor();
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatientFromDoctor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPatientFormData>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: '',
      age: 30,
      gender: 'MALE',
      phone: '',
      email: '',
      condition: 'Stable',
      diagnosis: '',
    },
  });

  if (!doctor) return null;

  const handleAddPatientSubmit = (data: AddPatientFormData) => {
    addPatient(
      { doctorId: doctor._id, data },
      {
        onSuccess: () => {
          reset();
          setShowAddForm(false);
        },
      },
    );
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to remove this patient from this doctor?')) {
      deletePatient({ doctorId: doctor._id, patientId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold truncate">
                {doctor.name}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-blue-600">{doctor.specialization}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 truncate text-muted-foreground">
                  <Building className="h-3 w-3 shrink-0" /> {doctor.hospital}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Doctor Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-muted-foreground border">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                doctor.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold text-foreground">Status: {doctor.status}</span>
          </div>
        </div>

        {/* Section: Corresponding Patients */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 shrink-0" />
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                Assigned Patients ({patients.length})
              </h3>
            </div>
            <Button
              size="sm"
              variant={showAddForm ? 'secondary' : 'default'}
              className="gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-xs"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              {showAddForm ? 'Close Form' : 'Add Patient under Doctor'}
            </Button>
          </div>

          {/* Add Patient inline form */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit(handleAddPatientSubmit)}
              className="p-4 sm:p-5 border rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 space-y-3 shadow-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                New Patient Intake Form
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="p-name" className="text-xs">
                    Patient Name *
                  </Label>
                  <Input id="p-name" placeholder="John Doe" {...register('name')} />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="p-age" className="text-xs">
                      Age *
                    </Label>
                    <Input
                      id="p-age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p-gender" className="text-xs">
                      Gender *
                    </Label>
                    <select
                      id="p-gender"
                      {...register('gender')}
                      className="w-full h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="p-phone" className="text-xs">
                    Phone *
                  </Label>
                  <Input id="p-phone" placeholder="+1 555-0100" {...register('phone')} />
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-cond" className="text-xs">
                    Condition *
                  </Label>
                  <select
                    id="p-cond"
                    {...register('condition')}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium"
                  >
                    <option value="Stable">Stable</option>
                    <option value="Under Observation">Under Observation</option>
                    <option value="Serious">Serious</option>
                    <option value="Critical">Critical</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="p-diag" className="text-xs">
                  Diagnosis / Clinical Notes
                </Label>
                <Input
                  id="p-diag"
                  placeholder="e.g. Mild hypertension, scheduled for follow-up"
                  {...register('diagnosis')}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAdding}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {isAdding ? 'Adding...' : 'Assign to Doctor'}
                </Button>
              </div>
            </form>
          )}

          {/* Loading state */}
          {isPatientsLoading && (
            <div className="p-8 text-center border rounded-2xl">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading assigned patients...
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isPatientsLoading && patients.length === 0 && (
            <div className="p-8 text-center border rounded-2xl text-muted-foreground text-sm bg-slate-50/50 dark:bg-slate-900/30">
              No patients assigned to this doctor yet. Click &apos;Add Patient under Doctor&apos; above.
            </div>
          )}

          {/* Mobile View: Stacked Patient Cards (ZERO horizontal scrolling) */}
          {!isPatientsLoading && patients.length > 0 && (
            <div className="md:hidden space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="p-3.5 rounded-xl border bg-card shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2 py-0.5 border shrink-0 ${
                        CONDITION_BADGE_STYLE[patient.condition] || ''
                      }`}
                    >
                      {patient.condition}
                    </Badge>
                  </div>

                  {patient.diagnosis && (
                    <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded-lg">
                      &ldquo;{patient.diagnosis}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-600" />
                      {patient.phone}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 gap-1 text-xs"
                      onClick={() => handleDeletePatient(patient._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop View: Full Table */}
          {!isPatientsLoading && patients.length > 0 && (
            <div className="hidden md:block border rounded-2xl overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold uppercase">Patient</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Age / Gender</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Condition</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Contact</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="font-semibold text-sm">
                        {patient.name}
                        {patient.diagnosis && (
                          <p className="text-xs text-muted-foreground font-normal">
                            {patient.diagnosis}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {patient.age}y • {patient.gender}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold px-2 py-0.5 border ${
                            CONDITION_BADGE_STYLE[patient.condition] || ''
                          }`}
                        >
                          {patient.condition}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{patient.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDeletePatient(patient._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
