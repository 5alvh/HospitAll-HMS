import { CommonModule, DatePipe, NgClass, NgFor, NgIf, Time, TitleCasePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../services/client-services/appointment.service';

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

export interface BookAppRequest {
  searchType: string,
  patientIdentifier: string,
  date: Date,
  time: string,
  reason: string
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
  cancelBookAppointment() {
    this.refreshAppointmentsForm();
    this.changeSection('dashboard');
  }

  showCancelledAppointments: boolean = true;
  filteredAppointments: any[] = [];
  appointmentsWithoutCancelled: any[] = [];
  selectedAppointment: any;
  filterStatus: string = 'all';
  currentDate: Date = new Date();
  appointments: any[] = [];
  activeSection: string = 'dashboard';
  showUserMenu: boolean = false;
  doctor!: DoctorDtoGet;
  prescriptions: MedicalPrescriptionDtoGet[] = [];
  feedback: Feedback[] = [];
  isLoading: boolean = true;

  dashboardStats = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };

  newAppointment: BookAppRequest = {
    searchType: '',
    patientIdentifier: '',
    date: new Date(),
    time: '',
    reason: ''
  };

  newPrescription: any = {
    patientId: '',
    patientName: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: ''
  };

  applyFilter() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      if (this.filterStatus === 'all') {
        return true;
      }
      return appointment.status.toLocaleLowerCase() === this.filterStatus.toLocaleLowerCase();
    });
  }
  filterFromCancelledAppointments() {
    if (this.showCancelledAppointments) {
      this.filteredAppointments = this.appointments.filter(appointment => {
        if (appointment.status !== "CANCELLED") {
          return true;
        } else {
          return false;
        }
      });
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  constructor(private docService: DoctorService,
    private localStorageService: LocalStorageManagerService,
    private router: Router,
    private appService: AppointmentService) { }

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
            reason: appointment.reason,
            diagnosis: appointment.diagnosis,
            type: appointment.type
          });
        });
        this.prescriptions = this.doctor.prescriptionsGiven;
        this.feedback = this.doctor.feedbacksReceived || [];

        this.filteredAppointments = this.appointments;
        this.filterFromCancelledAppointments();
        this.calculateDashboardStats()
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });

  }

  confirmAppointment(appId: any) {
    const appointment = this.appointments.find(a => a.id === appId);
    if (appointment) {
      this.docService.confirmAppointment(appId).subscribe({
        next: () => {
          appointment.status = AppointmentStatus.CONFIRMED;
        },
        error: (error) => {
          console.error('Error confirming appointment:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to confirm appointment. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
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
      const appointmentDate = new Date(appointment.appointmentDateTime);
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

    if (!this.newAppointment.searchType || !this.newAppointment.patientIdentifier || !this.newAppointment.date || !this.newAppointment.time || !this.newAppointment.reason) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.newAppointment.searchType === 'id') {
      const newAppointment = {
        searchType: this.newAppointment.searchType,
        id: this.newAppointment.patientIdentifier,
        date: this.newAppointment.date,
        startTime: this.newAppointment.time,
        status: 'CONFIRMED',
        reason: this.newAppointment.reason
      };
      this.appService.bookAppointmentByDoctorUsingClientId(newAppointment).subscribe({
        next: (response) => {
          this.appointments.push(response);
          this.refreshAppointmentsForm();
          Swal.fire({
            title: 'Success',
            text: 'Appointment booked successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.calculateDashboardStats();
        },
        error: (error) => {
          console.error('Error booking appointment:', error);

          Swal.fire({
            title: 'Error',
            text: 'Failed to book appointment. Please try again later. Check if the patient ID is valid.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
      return;
    }

    if (this.newAppointment.searchType === 'email') {
      const newAppointment = {
        searchType: this.newAppointment.searchType,
        patientEmail: this.newAppointment.patientIdentifier,
        date: this.newAppointment.date,
        startTime: this.newAppointment.time,
        status: 'CONFIRMED',
        reason: this.newAppointment.reason
      };
      this.appService.bookAppobookAppointmentByDoctorUsingClientEmail(newAppointment).subscribe({
        next: (response) => {
          this.appointments.push(response);
          this.refreshAppointmentsForm();
          Swal.fire({
            title: 'Success',
            text: 'Appointment booked successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.calculateDashboardStats();
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to book appointment. Please try again later. Check if the patient Email is valid.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
      return;
    }




    this.calculateDashboardStats();

    // In a real app, you would submit this to your backend API
  }

  refreshAppointmentsForm(): void {
    this.newAppointment = {
      searchType: '',
      patientIdentifier: '',
      date: new Date(),
      time: '',
      reason: ''
    };
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
      const appointmentDate = new Date(appointment.appointmentDateTime); // FIXED
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate() &&
        appointment.status !== AppointmentStatus.CANCELLED
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
  hasDiagnosis(appointmentId: number): boolean {
    const appointment = this.appointments.find(a => a.id === appointmentId);
    console.log(appointment.diagnosis);
    return appointment.diagnosis !== "UNAVAILABLE" && appointment.diagnosis !== null && appointment.diagnosis !== undefined;
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

  showDetails(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }
  closeDetails() {
    this.selectedAppointment = null;
  }

  logout() {
    this.localStorageService.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');

  }
}
