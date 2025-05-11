import { MembershipLevel } from "../enums/membership-level";
import { AppointmentDtoGet } from "./appointment-dto-get";
import { EmergencyContact } from "./emergency-contact";

export class ClientDtoGet {
  id!: number;
  fullName!: string;
  email!: string;
  phoneNumber!: string;
  dateOfBirth!: string; 
  membershipLevel!: MembershipLevel;
  emergencyContact!: EmergencyContact;
  createdAt!: string; 
  appointments!: AppointmentDtoGet[];

  constructor(init?: Partial<ClientDtoGet>) {
      Object.assign(this, init);
    }
}