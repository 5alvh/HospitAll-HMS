
import { AppointmentDtoGet } from "./appointment-dto-get";
import { EmergencyContact } from "./emergency-contact";
import { BloodType } from "./enums/blood-type";
import { MembershipLevel } from "./enums/membership-level";

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
  address!: string;
  bloodType!: BloodType;
  notifications!: boolean;

  constructor(init?: Partial<ClientDtoGet>) {
    Object.assign(this, init);
  }
}