import { CommonModule, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';

interface Appointment {
  id: number;
  clientFullName: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  reason?: string;
}

interface Prescription {
  id: number;
  clientEmail: string;
  prescribedTo: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  endDate: string;
  notes: string;
  createdAt: string;
  isPublished: boolean;
}

interface Feedback {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-doctor-dashboard',
  imports: [FormsModule, NgIf, NgFor, NgClass, DatePipe, CommonModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  providers: [DatePipe],
})
export class DoctorDashboardComponent {


  activeSection: string = 'dashboard';

  // Doctor information
  doctor!: DoctorDtoGet;

  // Appointments data
  appointments: Appointment[] = [];

  // Prescriptions data
  prescriptions: MedicalPrescriptionDtoGet[] = [];

  // Feedback data
  feedback: Feedback[] = [
    {
      id: 1,
      patientName: 'Alice Johnson',
      rating: 5,
      comment: 'Dr. Smith was very thorough and took time to explain everything clearly.',
      date: new Date('2025-05-18')
    },
    {
      id: 2,
      patientName: 'Dave Brown',
      rating: 4,
      comment: 'Good experience overall, though had to wait a bit longer than expected.',
      date: new Date('2025-05-15')
    }
  ];

  // Form models
  newAppointment: any = {
    patientName: '',
    date: null,
    time: '',
    notes: ''
  };

  newPrescription: any = {
    patientId: '',
    patientName: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: ''
  };

  // Dashboard stats
  dashboardStats = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };
  isLoading: boolean = true;

  constructor(private docService: DoctorService) { }

  ngOnInit(): void {
    this.docService.getProfile().subscribe({
      next: (response) => {
        this.doctor = response;
        this.isLoading = false;
        this.doctor.appointments.forEach((appointment: AppointmentDtoGet) => {
          const date = new Date(appointment.appointmentDateTime);
          this.appointments.push({
            id: appointment.id,
            clientFullName: appointment.clientFullName,
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appointment.status,
            reason: appointment.reason
          });
        });
        this.prescriptions = this.doctor.prescriptionsGiven;
        this.calculateDashboardStats()
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });
  }

  // Change active section
  changeSection(section: string): void {
    this.activeSection = section;
  }

  // Calculate dashboard statistics
  calculateDashboardStats(): void {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    this.dashboardStats.todayAppointments = this.appointments.filter(appointment => {
      const appointmentDate = appointment.date;
      return (
        appointmentDate.getFullYear() === todayYear &&
        appointmentDate.getMonth() === todayMonth &&
        appointmentDate.getDate() === todayDate
      );
    }).length;

    this.dashboardStats.pendingPrescriptions = this.prescriptions.filter(
      prescription => !prescription.isPublished
    ).length;

    this.dashboardStats.totalPatients = 150;

    const totalRating = this.feedback.reduce((sum, item) => sum + item.rating, 0);
    this.dashboardStats.averageRating = totalRating / this.feedback.length;
  }

  // Book a new appointment
  bookAppointment(): void {
    const id = this.appointments.length + 1;
    const newAppointment: Appointment = {
      id,
      clientFullName: this.newAppointment.patientName,
      date: this.newAppointment.date,
      time: this.newAppointment.time,
      status: AppointmentStatus.SCHEDULED,
      reason: this.newAppointment.notes
    };

    this.appointments.push(newAppointment);

    // Reset form
    this.newAppointment = {
      patientName: '',
      date: null,
      time: '',
      notes: ''
    };

    // Recalculate dashboard stats
    this.calculateDashboardStats();

    // In a real app, you would submit this to your backend API
    console.log('Appointment booked:', newAppointment);
  }

  // Create a new prescription
  createPrescription(): void {
    const id = this.prescriptions.length + 1;
    const newPrescription: Prescription = {
      id,
      clientEmail: 'parseInt(this.newPrescription.patientId)',
      prescribedTo: this.newPrescription.patientName,
      medicationName: this.newPrescription.medications[0].name,
      dosage: this.newPrescription.medications[0].dosage,
      frequency: this.newPrescription.medications[0].frequency,
      endDate: this.newPrescription.medications[0].duration,
      notes: this.newPrescription.instructions,
      createdAt: 'new Date()',
      isPublished: false
    };


    // Reset form
    this.newPrescription = {
      patientId: '',
      patientName: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      instructions: ''
    };

    // Recalculate dashboard stats
    this.calculateDashboardStats();

    // In a real app, you would submit this to your backend API
    console.log('Prescription created:', newPrescription);
  }

  // Add medication field to prescription form
  addMedication(): void {
    this.newPrescription.medications.push({
      name: '',
      dosage: '',
      frequency: '',
      duration: ''
    });
  }

  // Remove medication field from prescription form
  removeMedication(index: number): void {
    if (this.newPrescription.medications.length > 1) {
      this.newPrescription.medications.splice(index, 1);
    }
  }

  // Publish a prescription
  publishPrescription(id: number): void {
    const index = this.prescriptions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.prescriptions[index].isPublished = true;

      // Recalculate dashboard stats
      this.calculateDashboardStats();

      // In a real app, you would submit this to your backend API
      console.log('Prescription published:', this.prescriptions[index]);
    }
  }
}
