import { DepartmentDto } from "./department";

export interface DoctorDtoGet {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    createdAt: string;
    medicalLicenseNumber: string;
    department: DepartmentDto;
    specialization: string;
    address: string;
}
