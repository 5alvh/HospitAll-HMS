export interface LabResultDtoGet {
  id: number;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  resultDate: string; 
  notes: string;
  patientFullName: string;
  doctorFullName: string;
  createdAt: string; 
  updatedAt: string;
  version: number;
  status: string;
}