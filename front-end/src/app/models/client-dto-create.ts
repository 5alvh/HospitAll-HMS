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
  
    constructor(init?: Partial<ClientDtoCreate>) {
      Object.assign(this, init);
    }
  }