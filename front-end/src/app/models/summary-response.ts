import { AppointmentDtoGet } from "./appointment-dto-get";
import { MedicalPrescriptionDtoGet } from "./medical-prescription-dto-get";
import { NotificationDto } from "./notification-dto";

export interface SummaryResponse {
    fullName: string,
    appointments: AppointmentDtoGet[],
    prescriptions: MedicalPrescriptionDtoGet[],
    notifications: NotificationDto[]
}
