export interface Patient {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

