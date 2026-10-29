import { Doctor } from './doctor';

export type PatientCondition =
  | 'Critical'
  | 'Stable'
  | 'Recovered'
  | 'Under Observation'
  | 'Serious';

export type PatientGender = 'MALE' | 'FEMALE' | 'OTHER';
export type PatientStatus = 'ACTIVE' | 'DISCHARGED';

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  doctor: string | Doctor;
  condition: PatientCondition;
  diagnosis?: string;
  admissionDate?: string;
  status: PatientStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientInput {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  doctor?: string;
  condition?: PatientCondition;
  diagnosis?: string;
  admissionDate?: string;
  status?: PatientStatus;
}

export type UpdatePatientInput = Partial<CreatePatientInput>;
