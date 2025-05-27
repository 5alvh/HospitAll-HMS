import { AppointmentType } from "./enums/appointment-type";

export class AppointmentCreateDto {
    doctorId!: number;
    date!: Date;
    startTime!: string;
    type!: AppointmentType;
    reason?: string;
  
    constructor(init?: Partial<AppointmentCreateDto>) {
      Object.assign(this, init);
    }

  }