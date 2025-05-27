import { Feedback } from "../doctor/doctor-dashboard/doctor-dashboard.component";
import { AppointmentDtoGet } from "./appointment-dto-get";
import { DepartmentDto } from "./department";
import { LabResultDtoGet } from "./lab-result-dto-get";
import { MedicalPrescriptionDtoGet } from "./medical-prescription-dto-get";

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
    prescriptionsGiven: MedicalPrescriptionDtoGet[];
    appointments: AppointmentDtoGet[];
    feedbacksReceived: Feedback[];
}
