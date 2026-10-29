export interface Doctor {
  _id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  bio?: string;
  isAvailable: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

