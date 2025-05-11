import { BloodType } from "../enums/blood-type";
import { MembershipLevel } from "../enums/membership-level";
import { EmergencyContact } from "./emergency-contact";

export class ClientDtoCreate {
    fullName!: string;
    email!: string;
    password!: string;
    passwordConfirmation!: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    membershipLevel?: MembershipLevel;
    emergencyContact?: EmergencyContact;
    address?: string;
    bloodType?: BloodType; // Assuming blood type is a string, adjust as necessary
    constructor(init?: Partial<ClientDtoCreate>) {
      Object.assign(this, init);
    }
  }