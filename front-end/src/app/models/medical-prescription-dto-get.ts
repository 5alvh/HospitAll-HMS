import { PrescriptionStatus } from "./enums/prescription-status";

export interface MedicalPrescriptionDtoGet {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;     
  endDate: string;         
  notes: string;
  prescribedBy: string;
  createdAt: string;  
  prescribedTo: string;
  clientEmail: string;
  status: string;     
}
