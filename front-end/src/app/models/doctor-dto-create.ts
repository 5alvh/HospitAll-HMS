import { Specialization } from "./enums/specialization";
import { WorkingHours } from "./working-hours";

export class DoctorDtoCreate {
    fullName: string;
    email: string;
    hashedPassword: string;
    passwordConfirmation: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    medicalLicenseNumber: string;
    departmentId: number;
    specialization?: string;
    workingHours?: WorkingHours[];
    address?: string;

    constructor(
        fullName: string,
        email: string,
        hashedPassword: string,
        passwordConfirmation: string,
        medicalLicenseNumber: string,
        departmentId: number,
        phoneNumber?: string,
        dateOfBirth?: Date,
        specialization?: Specialization,
        workingHours?: WorkingHours[],
        address?: string
    ) {
        this.fullName = fullName;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.passwordConfirmation = passwordConfirmation;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.medicalLicenseNumber = medicalLicenseNumber;
        this.departmentId = departmentId;
        this.specialization = specialization;
        this.workingHours = workingHours;
        this.address = address;
    }
}