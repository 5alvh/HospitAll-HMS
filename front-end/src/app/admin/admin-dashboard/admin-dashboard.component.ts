import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Department {
  id: number;
  name: string;
  headDoctorId?: number;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  medicalLicense: string;
  departmentId: number;
  status: 'ACTIVE' | 'INACTIVE';
  workingHours: WorkingHours[];
}

interface WorkingHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Appointment {
  id: number;
  doctorId: number;
  patientName: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: 'IN_PERSON' | 'VIRTUAL';
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgFor, NgIf, FormsModule, TitleCasePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [TitleCasePipe]
})
export class AdminDashboardComponent {

   activeSection = 'users';
  selectedUserType = 'all';
  
  users: any[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'client', status: 'active', createdDate: new Date() },
    { id: 2, name: 'Dr. Smith', email: 'smith@example.com', type: 'doctor', status: 'active', createdDate: new Date() },
    { id: 3, name: 'Jane Wilson', email: 'jane@example.com', type: 'client', status: 'inactive', createdDate: new Date() },
    { id: 4, name: 'Dr. Johnson', email: 'johnson@example.com', type: 'doctor', status: 'active', createdDate: new Date() }
  ];
  
  filteredUsers: any[] = [];

  ngOnInit() {
    this.filterUsers();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  filterUsers() {
    if (this.selectedUserType === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => user.type === this.selectedUserType);
    }
  }

  // User Management Methods
  createUser() {
    console.log('Creating new user...');
  }

  editUser(user: any) {
    console.log('Editing user:', user);
  }

  deleteUser(user: any) {
    console.log('Deleting user:', user);
  }

  resetPassword() {
    console.log('Resetting password...');
  }

  // Doctor Management Methods
  addDoctor() {
    console.log('Adding new doctor...');
  }

  assignDepartment() {
    console.log('Assigning doctor to department...');
  }

  // Client Management Methods
  addClient() {
    console.log('Adding new client...');
  }

  updateMedicalInfo() {
    console.log('Updating medical information...');
  }

  // Lab Results Methods
  addLabResult() {
    console.log('Adding lab result...');
  }

  assignDoctor() {
    console.log('Assigning doctor...');
  }

  // Prescription Methods
  createPrescription() {
    console.log('Creating prescription...');
  }

  revokePrescription() {
    console.log('Revoking prescription...');
  }

  // Department Methods
  createDepartment() {
    console.log('Creating department...');
  }

  assignHeadDoctor() {
    console.log('Assigning head doctor...');
  }

  // Scheduling Methods
  updateSchedule() {
    console.log('Updating schedule...');
  }

  // Notification Methods
  sendNotification() {
    console.log('Sending notification...');
  }

  markAllRead() {
    console.log('Marking all notifications as read...');
  }
}
