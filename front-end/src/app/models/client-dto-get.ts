
import { Feedback } from "../doctor/doctor-dashboard/doctor-dashboard.component";
import { AppointmentDtoGet } from "./appointment-dto-get";
import { EmergencyContact } from "./emergency-contact";
import { BloodType } from "./enums/blood-type";
import { MembershipLevel } from "./enums/membership-level";
import { LabResultDtoGet } from "./lab-result-dto-get";
import { MedicalPrescriptionDtoGet } from "./medical-prescription-dto-get";
import { NotificationDto } from "./notification-dto";

export class ClientDtoGet {
  id!: number;
  fullName!: string;
  email!: string;
  phoneNumber!: string;
  dateOfBirth!: string;
  membershipLevel!: MembershipLevel;
  emergencyContact!: EmergencyContact;
  createdAt!: string;
  address!: string;
  bloodType!: BloodType;

  constructor(init?: Partial<ClientDtoGet>) {
    Object.assign(this, init);
  }
}