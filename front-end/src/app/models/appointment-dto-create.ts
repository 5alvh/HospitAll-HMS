
export class AppointmentCreateDto {
    clientEmail!: string;
    doctorEmail!: string;
    appointmentDateTime!: Date;
    reason?: string;
  
    constructor(init?: Partial<AppointmentCreateDto>) {
      Object.assign(this, init);
    }

  }