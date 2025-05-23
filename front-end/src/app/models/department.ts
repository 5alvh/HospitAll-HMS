export interface DepartmentDto {
  id: number;
  name: string;
  description?: string;
  headDoctor?: any;
  contactNumber: string;
  location?: string;
  createdAt: string;       
  updatedAt?: string;       
  version: number;
}