export class Department {
    id?: number;
    name: string;
    description?: string;
    headDoctor?: any;
    contactNumber: string;
    location?: string;
    doctors: any[] = [];
    createdAt?: Date;
    updatedAt?: Date;
    version?: number;

    constructor(
        name: string,
        contactNumber: string,
        description?: string,
        headDoctor?: any,
        location?: string,
        doctors: any[] = [],
        createdAt?: Date,
        updatedAt?: Date,
        version?: number,
        id?: number
    ) {
        this.name = name;
        this.contactNumber = contactNumber;
        this.description = description;
        this.headDoctor = headDoctor;
        this.location = location;
        this.doctors = doctors;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.version = version;
        this.id = id;
    }
}