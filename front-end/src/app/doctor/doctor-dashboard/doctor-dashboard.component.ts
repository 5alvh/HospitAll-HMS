import { CommonModule, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';

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

export interface Feedback {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

@Component({
  selector: 'app-doctor-dashboard',
  imports: [FormsModule, NgIf, NgFor, NgClass, DatePipe, CommonModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class DoctorDashboardComponent {


  currentDate: Date = new Date();
  appointments: any[] = [];
  activeSection: string = 'dashboard';

  showUserMenu: boolean = false;
  doctor!: DoctorDtoGet;
  prescriptions: MedicalPrescriptionDtoGet[] = [];

  // Feedback data
  feedback: Feedback[] = [
    
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

  constructor(private docService: DoctorService, private localStorageService: LocalStorageManagerService, private router: Router) { }

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
            appointmentDateTime: appointment.appointmentDateTime, // Keep the original datetime string
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appointment.status,
            reason: appointment.reason
          });
        });
        this.prescriptions = this.doctor.prescriptionsGiven;
        this.feedback = this.doctor.feedbacksReceived || [];
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

    this.docService.getNumberOfPatientsByDoctorId(this.doctor.id).subscribe({
      next: (response) => {
        this.dashboardStats.totalPatients = response;
      },
      error: (error) => {
        console.error('Error fetching number of patients:', error);
      }
    });
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


  

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard Overview',
      'calendar': 'Appointment Calendar',
      'appointments': 'Appointments Management',
      'book-appointment': 'Book New Appointment',
      'prescriptions': 'Medical Prescriptions',
      'create-prescription': 'Create Prescription',
      'profile': 'My Profile',
      'feedback': 'Patient Feedback',
      'support': 'Support & Help'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  getAppointmentTrend(): string {
    return this.dashboardStats.todayAppointments > 5 ? 'Busy day' : 'Manageable schedule';
  }

  getTodaysAppointments(): any[] {
    const today = new Date();
    return this.appointments.filter(appointment => {
      const appointmentDate = appointment.date;
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      );
    });
  }

  getCurrentMonth(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getCalendarDays(): any[] {
    const days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const endDay = lastDayOfMonth.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.buildDay(date, false));
    }

    for (let i = 1; i <= endDay; i++) {
      const date = new Date(year, month, i);
      days.push(this.buildDay(date, true));
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.buildDay(date, false));
    }

    console.log('Calendar days:', days);
    return days;
  }

  buildDay(date: Date, isCurrentMonth: boolean): any {
    const dayAppointments = this.appointments.filter(app => {
      const appDate = new Date(app.appointmentDateTime);
      
      return appDate.getFullYear() === date.getFullYear() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getDate() === date.getDate();
    });

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return {
      date,
      number: date.getDate(),
      isCurrentMonth,
      isToday,
      hasAppointments: dayAppointments.length > 0,
      appointments: dayAppointments.map(app => ({
        time: new Date(app.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clientFullName: app.clientFullName,
        status: app.status,
      }))
    };
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }
  hasPrescription(appointmentId: number): boolean {
    return this.prescriptions.some(p => p.id === appointmentId);
  }

  createPrescriptionForAppointment(appointment: any) {
    this.newPrescription.patientName = appointment.clientFullName;
    this.newPrescription.appointmentId = appointment.id;
    this.changeSection('create-prescription');
  }

  getConnectedAppointment(prescriptionId: number): any {
    const prescription = this.prescriptions.find(p => p.id === prescriptionId);
    return prescription ? this.appointments.find(a => a.id === prescription.id) : null;
  }

  getPublishedPrescriptions(): any[] {
    return this.prescriptions.filter(p => p.isPublished);
  }

  getDraftPrescriptions(): any[] {
    return this.prescriptions.filter(p => !p.isPublished);
  }

  getRatingPercentage(rating: number): number {
    const count = this.feedback.filter(f => f.rating === rating).length;
    return this.feedback.length > 0 ? (count / this.feedback.length) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    return this.feedback.filter(f => f.rating === rating).length;
  }

  logout() {
    this.localStorageService.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');

  }
}
