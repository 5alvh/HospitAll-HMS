import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { AppointmentDtoGet } from '../../models/appointment-dto-get';
import { AppointmentStatus } from '../../models/enums/appointment-status';
import { MedicalPrescriptionDtoGet } from '../../models/medical-prescription-dto-get';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import Swal from 'sweetalert2';
import { PrescriptionStatus } from '../../models/enums/prescription-status';
import { FilesGeneratorService } from '../../services/shared-services/files-generator.service';
import { AppointmentService } from '../../client/services/appointment.service';
import { DashboardSummaryComponent } from "./dashboard-summary/dashboard-summary.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ProfileComponent } from "./profile/profile.component";
import { AppointmentListComponent } from "./appointment-list/appointment-list.component";
import { SupportComponent } from "./support/support.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PrescriptionsComponent } from "./prescriptions/prescriptions.component";
import { PatientsComponent } from "./patients/patients.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";


export interface Feedback {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  type: string;
}

export interface BookAppRequest {
  searchType: string,
  patientIdentifier: string,
  date: Date,
  time: string,
  reason: string
}

export interface prescriptionRequest {
  searchType: string,
  patientIdentifier: string,
  medications: [{ medicationName: string, dosage: string, frequency: string, duration: string, notes: string }],
  appointmentId: number,
  status: string
}

export interface MedicalPrescriptionDtoUpdate {
  id: number,
  medicationName: string,
  dosage: string,
  frequency: string,
  startDate: string,
  duration: number,
  notes: string,
  prescribedEmail: string
}
@Component({
  selector: 'app-doctor-dashboard',
  imports: [FormsModule, NgIf, RouterOutlet,CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class DoctorDashboardComponent {

  selectedPrescription: MedicalPrescriptionDtoUpdate | null = null;
  isEditModalOpen: boolean = false;
  showDiagnosisForm: { [key: string]: boolean } = {};
  diagnosisInputs: { [key: string]: string } = {};
  showCancelledAppointments: boolean = true;
  appointmentsWithoutCancelled: any[] = [];
  selectedAppointment: any;
  filterStatus: string = 'all';
  currentDate: Date = new Date();
  appointments: any[] = [];
  activeSection: string = 'dashboard';
  showUserMenu: boolean = false;
  doctor!: DoctorDtoGet;
  prescriptions: MedicalPrescriptionDtoGet[] = [];
  feedbacks: Feedback[] = [];
  isLoading: boolean = true;
  todaysAppointments: any[] = [];

  dashboardStats = {
    todayAppointments: 0,
    pendingPrescriptions: 0,
    totalPatients: 0,
    averageRating: 0
  };

  newAppointment: BookAppRequest = {
    searchType: 'id',
    patientIdentifier: '',
    date: new Date(),
    time: '',
    reason: ''
  };

  newPrescription: prescriptionRequest = {
    searchType: 'id',
    patientIdentifier: '',
    medications: [{ medicationName: '', dosage: '', frequency: '', duration: '', notes: '' }],
    appointmentId: 0,
    status: ''
  };
  changeSection(section: string): void {
    console.log('Section changed to:', section);
    this.activeSection = section;
  }

  constructor(private docService: DoctorService,
    private localStorageService: LocalStorageManagerService,
    private router: Router,
    private appService: AppointmentService,
    private filesGenerator: FilesGeneratorService) { }



  ngOnInit(): void {
    this.docService.getProfile().subscribe({
      next: (response) => {
        console.log(response)
        this.doctor = response;
        this.isLoading = false;

        console.log(this.prescriptions);
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });

  }

  openEditModal(prescription: MedicalPrescriptionDtoGet): void {
    this.selectedPrescription = {
      id: prescription.id,
      medicationName: prescription.medicationName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      startDate: prescription.startDate,
      duration: this.getDateDifferenceInDays(prescription.startDate, prescription.endDate),
      notes: prescription.notes,
      prescribedEmail: prescription.clientEmail
    };
    this.isEditModalOpen = true;
    console.log(prescription.startDate + " " + prescription.endDate)
  }

  closeModal(): void {
    this.selectedPrescription = null;
    this.isEditModalOpen = false;
  }

  updatePrescription(): void {
    if (this.selectedPrescription) {
      this.docService.updatePrescription(this.selectedPrescription).subscribe({
        next: (res) => {
          console.log('Prescription updated successfully.');
          Swal.fire({
            title: 'Success',
            text: 'Prescription updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        },
        error: (error) => {
          console.error('Error updating prescription:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to update prescription.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      })
    }
    this.closeModal();
  }

  toggleDiagnosisForm(appointment: any): void {
    this.showDiagnosisForm[appointment.id] = !this.showDiagnosisForm[appointment.id];
    this.diagnosisInputs[appointment.id] = appointment.diagnosis === 'UNAVAILABLE' ? '' : appointment.diagnosis;
  }

  submitDiagnosis(appointmentId: number): void {
    var diagnosis = this.diagnosisInputs[appointmentId];

    if (!appointmentId) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a diagnosis.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return;
    }
    if (diagnosis === '') {
      diagnosis = 'UNAVAILABLE';
    }

    console.log(`Publishing diagnosis for appointment ${appointmentId}: ${diagnosis}`);

    this.diagnosisInputs[appointmentId] = '';
    this.showDiagnosisForm[appointmentId] = false;
  }
  cancelBookAppointment() {
    this.refreshAppointmentsForm();
    this.changeSection('dashboard');
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

  completeAppointment(appId: any) {
    const appointment = this.appointments.find(a => a.id === appId);
    if (appointment) {
      this.docService.completeAppointment(appId).subscribe({
        next: () => {
          appointment.status = AppointmentStatus.COMPLETED;
        },
        error: (error) => {
          console.error('Error completing appointment:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to complete appointment. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }



  downloadAppointment(appointmentId: number) {
    console.log('Downloading appointment PDF for ID:', appointmentId);
    this.filesGenerator.getAppointmentPdf(appointmentId).subscribe({
      next: (pdfBlob: Blob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `appointment_${appointmentId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('PDF download failed:', err);
      }
    });
  }

  downloadPrescription(prescriptionId: number) {
    this.filesGenerator.getMedicalPrescriptionPdf(prescriptionId).subscribe({
      next: (pdfBlob: Blob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `appointment_${prescriptionId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('PDF download failed:', err);
      }
    });
  }

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
  }

  refreshAppointmentsForm(): void {
    this.newAppointment = {
      searchType: 'id',
      patientIdentifier: '',
      date: new Date(),
      time: '',
      reason: ''
    };
  }

  deletePrescription(prescriptionId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this prescription?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.docService.deletePrescription(prescriptionId).subscribe({
          next: () => {
            this.prescriptions = this.prescriptions.filter(prescription => prescription.id !== prescriptionId);
            Swal.fire({
              title: 'Success',
              text: 'Prescription deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (error) => {
            console.error('Error deleting prescription:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete prescription. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    })

  }
  createPrescription(status: string): void {
    console.log(this.newPrescription);

    const prescriptionRequest = {
      searchType: this.newPrescription.searchType.toUpperCase(),
      ...(this.newPrescription.searchType.toUpperCase() === 'EMAIL'
        ? { clientEmail: this.newPrescription.patientIdentifier }
        : { clientId: this.newPrescription.patientIdentifier }),
      medications: this.newPrescription.medications,
      appointmentId: this.newPrescription.appointmentId,
      status: status.toUpperCase()
    };

    this.docService.createPrescription(prescriptionRequest).subscribe({
      next: (response) => {
        this.refreshPrescriptionsForm();
        Swal.fire({
          title: 'Success',
          text: 'Prescription created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Error creating prescription:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to create prescription. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
  }

  refreshPrescriptionsForm(): void {
    this.newPrescription = {
      searchType: 'id',
      patientIdentifier: '',
      medications: [{ medicationName: '', dosage: '', frequency: '', duration: '', notes: '' }],
      appointmentId: 0,
      status: ''
    };
  }

  addMedication(): void {
    this.newPrescription.medications.push({
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
  }

  removeMedication(index: number): void {
    if (this.newPrescription.medications.length > 1) {
      this.newPrescription.medications.splice(index, 1);
    }
  }

  publishPrescription(id: number): void {

    if (id !== null) {
      this.docService.publishPrescription(id).subscribe({
        next: (response) => {
          const prescription = this.prescriptions.find(prescription => prescription.id === id);
          if (prescription !== null) {
            prescription!.status = PrescriptionStatus.PUBLISHED;
          }
          this.refreshPrescriptionsForm();

          Swal.fire({
            title: 'Success',
            text: 'Prescription published successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error publishing prescription:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to publish prescription. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })

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
    this.changeSection('create-prescription');
    this.newPrescription.appointmentId = appointment.id;
  }

  getConnectedAppointment(prescriptionId: number): any {
    const prescription = this.prescriptions.find(p => p.id === prescriptionId);
    return null;
  }

  getPublishedPrescriptions(): any[] {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.PUBLISHED);
  }

  getDraftPrescriptions(): any[] {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.DRAFT);
  }

  isPublished(prescription: any): boolean {
    return prescription.status === PrescriptionStatus.PUBLISHED;
  }
  getRatingPercentage(rating: number): number {
    const count = this.feedbacks.filter(f => f.rating === rating).length;
    return this.feedbacks.length > 0 ? (count / this.feedbacks.length) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    return this.feedbacks.filter(f => f.rating === rating).length;
  }

  showDetails(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }
  closeDetails() {
    this.selectedAppointment = null;
  }

  logout() {
    this.localStorageService.clearAuth();
    this.router.navigate(['/login']);
    console.log('Logging out...');

  }
  private getDateDifferenceInDays(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Aseguramos que ambas fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const msInOneDay = 1000 * 60 * 60 * 24;
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInMs / msInOneDay);

    return diffInDays;
  }
}
