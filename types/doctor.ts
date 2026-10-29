export type DoctorStatus = 'ACTIVE' | 'INACTIVE';

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status: DoctorStatus;
  patientCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorInput {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status?: DoctorStatus;
}

export type UpdateDoctorInput = Partial<CreateDoctorInput>;
