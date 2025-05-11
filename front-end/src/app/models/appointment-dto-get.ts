import { AppointmentStatus } from "./enums/appointment-status";
import { AppointmentType } from "./enums/appointment-type";


export interface AppointmentDtoGet {
  id: number;
  clientFullName: string;
  doctorFullName: string;
  reason: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  departmentName: string;
}