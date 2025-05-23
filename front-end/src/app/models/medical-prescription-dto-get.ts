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
  isPublished: boolean;     
}
