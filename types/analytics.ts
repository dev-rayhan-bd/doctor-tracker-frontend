export interface DashboardKPI {
  totalDoctors: number;
  totalPatients: number;
  criticalPatients: number;
  stablePatients: number;
  recoveredPatients: number;
  seriousPatients: number;
  underObservationPatients: number;
}

export interface PatientsPerDoctorStat {
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}

export interface DateBasedStat {
  date: string;
  patients: number;
  doctors: number;
}

export interface CategoryDistribution {
  _id: string;
  count: number;
}

export interface DashboardAnalyticsData {
  kpi: DashboardKPI;
  charts: {
    patientsPerDoctor: PatientsPerDoctorStat[];
    dateBasedStatistics: DateBasedStat[];
    conditionDistribution: CategoryDistribution[];
    specializationDistribution: CategoryDistribution[];
  };
}

