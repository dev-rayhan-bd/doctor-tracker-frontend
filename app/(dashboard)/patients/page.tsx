'use client';

import { useState } from 'react';
import {
  Search,
  Users,
  Phone,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { usePatients, useDeletePatient } from '@/features/patient/hooks/use-patients';
import { Patient, PatientCondition } from '@/types/patient';
import { CreatePatientDialog } from '@/features/patient/components/create-patient-dialog';
import { EditPatientDialog } from '@/features/patient/components/edit-patient-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CONDITION_BADGES: Record<PatientCondition, string> = {
  Critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
  Serious: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300',
  'Under Observation': 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
  Stable: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
  Recovered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data, isLoading } = usePatients({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    condition: conditionFilter || undefined,
    status: statusFilter || undefined,
  });

  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();

  const patients = data?.data || [];
  const meta = data?.meta;

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setEditDialogOpen(true);
  };

  const promptDelete = (id: string, name: string) => {
    setPatientToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id, {
        onSettled: () => {
          setDeleteConfirmOpen(false);
          setPatientToDelete(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Patient Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track clinical admissions, severity conditions, and attending physicians.
          </p>
        </div>

        <CreatePatientDialog />
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-card rounded-2xl border shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, diagnosis..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Condition Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={conditionFilter}
              onChange={(e) => {
                setConditionFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 py-1 rounded-xl border border-input bg-slate-50 dark:bg-slate-900 text-sm font-medium"
            >
              <option value="">All Conditions</option>
              <option value="Critical">Critical</option>
              <option value="Serious">Serious</option>
              <option value="Under Observation">Under Observation</option>
              <option value="Stable">Stable</option>
              <option value="Recovered">Recovered</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 py-1 rounded-xl border border-input bg-slate-50 dark:bg-slate-900 text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active (In Care)</option>
            <option value="DISCHARGED">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase">Patient Info</TableHead>
              <TableHead className="font-bold text-xs uppercase">Attending Doctor</TableHead>
              <TableHead className="font-bold text-xs uppercase">Condition</TableHead>
              <TableHead className="font-bold text-xs uppercase">Status</TableHead>
              <TableHead className="font-bold text-xs uppercase">Admission</TableHead>
              <TableHead className="font-bold text-xs uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Fetching patient directory...
                  </div>
                </TableCell>
              </TableRow>
            ) : patients.length > 0 ? (
              patients.map((patient) => {
                const doctorName =
                  typeof patient.doctor === 'object' && patient.doctor
                    ? patient.doctor.name
                    : 'Assigned';
                const doctorSpec =
                  typeof patient.doctor === 'object' && patient.doctor
                    ? patient.doctor.specialization
                    : '';

                return (
                  <TableRow key={patient._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {patient.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {patient.age} yrs • {patient.gender} • {patient.phone}
                          </p>
                          {patient.diagnosis && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5 max-w-xs truncate">
                              &ldquo;{patient.diagnosis}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                        <span>{doctorName}</span>
                      </div>
                      {doctorSpec && (
                        <p className="text-xs text-muted-foreground ml-5">{doctorSpec}</p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2.5 py-0.5 border ${
                          CONDITION_BADGES[patient.condition] || ''
                        }`}
                      >
                        {patient.condition}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          patient.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {patient.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => promptDelete(patient._id, patient.name)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                  No patients found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="p-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing Page {meta.page} of {meta.page ? meta.totalPage : 1} ({meta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="gap-1 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => (meta.totalPage ? Math.min(meta.totalPage, p + 1) : p + 1))}
                disabled={meta.totalPage ? page >= meta.totalPage : true}
                className="gap-1 rounded-xl"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Patient Dialog */}
      <EditPatientDialog
        patient={editingPatient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Delete Patient Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Discharge / Remove Patient"
        description={`Are you sure you want to remove the medical record for ${patientToDelete?.name || ''}? This action cannot be undone.`}
        confirmText="Remove Patient"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

