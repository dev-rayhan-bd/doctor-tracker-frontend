'use client';

import { useState } from 'react';
import {
  Search,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useDoctors, useDeleteDoctor } from '@/features/doctor/hooks/use-doctors';
import { Doctor } from '@/types/doctor';
import { CreateDoctorDialog } from '@/features/doctor/components/create-doctor-dialog';
import { DoctorDetailsDialog } from '@/features/doctor/components/doctor-details-dialog';
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

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data, isLoading } = useDoctors({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const { mutate: deleteDoctor, isPending: isDeleting } = useDeleteDoctor();

  const doctors = data?.data || [];
  const meta = data?.meta;

  const handleOpenDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsOpen(true);
  };

  const promptDelete = (id: string, name: string) => {
    setDoctorToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      deleteDoctor(doctorToDelete.id, {
        onSettled: () => {
          setDeleteConfirmOpen(false);
          setDoctorToDelete(null);
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
            Doctor Directory
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage certified medical practitioners, monitor workloads, and manage rosters.
          </p>
        </div>

        <CreateDoctorDialog />
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-card rounded-2xl border shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, hospital..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 py-1 rounded-xl border border-input bg-slate-50 dark:bg-slate-900 text-sm font-medium"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase">Specialist</TableHead>
              <TableHead className="font-bold text-xs uppercase">Hospital</TableHead>
              <TableHead className="font-bold text-xs uppercase">Contact</TableHead>
              <TableHead className="font-bold text-xs uppercase">Status</TableHead>
              <TableHead className="font-bold text-xs uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Fetching doctor directory...
                  </div>
                </TableCell>
              </TableRow>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => (
                <TableRow key={doctor._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {doctor.name}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 mt-0.5"
                        >
                          {doctor.specialization}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{doctor.hospital}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        doctor.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => handleOpenDetails(doctor)}
                      >
                        <Users className="h-3.5 w-3.5" />
                        Patients
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => promptDelete(doctor._id, doctor.name)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                  No doctors found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Pagination Controls */}
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

      {/* Details & Patients Dialog */}
      <DoctorDetailsDialog
        doctor={selectedDoctor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Specialist Record"
        description={`Are you sure you want to remove Dr. ${doctorToDelete?.name || ''}? All clinical patient associations will be disassociated.`}
        confirmText="Delete Doctor"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

