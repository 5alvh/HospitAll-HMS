export class EmergencyContact {
    contactName!: string;
    contactPhone!: string;
    relationship?: string;
  
    constructor(init?: Partial<EmergencyContact>) {
      Object.assign(this, init);
    }
  }
