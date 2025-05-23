import { EmergencyContact } from "./emergency-contact";
import { BloodType } from "./enums/blood-type";
import { MembershipLevel } from "./enums/membership-level";

export interface ClientDtoUpdate {
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date string (e.g. "1990-01-01")
  membershipLevel?: MembershipLevel;
  emergencyContact?: EmergencyContact;
  address?: string;
  bloodType?: BloodType;
}