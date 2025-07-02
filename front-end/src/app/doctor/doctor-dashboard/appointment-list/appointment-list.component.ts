import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';
import { DoctorService } from '../../../services/doctor-services/doctor.service';
import { AppointmentStatus } from '../../../models/enums/appointment-status';
import Swal from 'sweetalert2';
import { FilesGeneratorService } from '../../../services/shared-services/files-generator.service';
import { AppointmentService } from '../../../services/doctor-services/appointment.service';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-list',
  imports: [NgIf, NgFor, FormsModule, DatePipe, NgClass, FontAwesomeModule, NgClass],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentListComponent implements OnInit {
  filterStatus: string = 'all';
  showCancelledAppointments: boolean = true;
  showDiagnosisForm: { [key: string]: boolean } = {};
  diagnosisInputs: { [key: string]: string } = {};
  selectedAppointment: any;

  filteredAppointments: any[] = [];
  appointments: any[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  size: number = 10;

  after?: string;
  before?: string;

  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };
  previousPage() {
    this.currentPage--;
    this.loadAppointments();

  }
  nextPage() {
    this.currentPage++;
    this.loadAppointments();
  }
  constructor(private docService: DoctorService, private appointmentService: AppointmentService, private filesGenerator: FilesGeneratorService) { }

  loadAppointments() {
    this.appointments = [];
    const beforeDate = this.before ? new Date(this.before) : undefined;
    const afterDate = this.after ? new Date(this.after) : undefined;
    console.log(beforeDate);
    console.log(afterDate);
    this.appointmentService.getAllAppointmentsPaged(this.currentPage, this.size, this.filterStatus, !this.showCancelledAppointments, beforeDate, afterDate).subscribe(
      (response) => {
        this.totalPages = response.totalPages - 1 || 0;
        response.content.forEach((appointment: AppointmentDtoGet) => {
          const date = new Date(appointment.appointmentDateTime);
          this.appointments.push({
            id: appointment.id,
            clientFullName: appointment.clientFullName,
            appointmentDateTime: appointment.appointmentDateTime,
            date: date,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appointment.status,
            reason: appointment.reason,
            diagnosis: appointment.diagnosis,
            type: appointment.type
          });
        });

        this.filteredAppointments = this.appointments
      },
      (error) => {
        console.log(error)
      }
    )
  }

  applyFilter() {
    this.currentPage = 0;
    this.loadAppointments()
  }

  filterFromCancelledAppointments() {
    console.log(this.showCancelledAppointments)
    this.currentPage = 0;
    this.loadAppointments();
  }
  ngOnInit(): void {
    this.loadAppointments()
  }

  closeDetails() {
    this.selectedAppointment = null;
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
  showDetails(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }

  createPrescriptionForAppointment(appointment: any) {
    //this.changeSection('create-prescription');
    //this.newPrescription.appointmentId = appointment.id;
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
    this.appointmentService.giveDiagnosis(appointmentId, diagnosis).subscribe({
      next: (res) => {
        console.log('Diagnosis published successfully.');
        this.appointments.find(a => a.id === appointmentId)!.diagnosis = diagnosis;
        Swal.fire({
          title: 'Success',
          text: 'Diagnosis published successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to publish diagnosis. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
    this.diagnosisInputs[appointmentId] = '';
    this.showDiagnosisForm[appointmentId] = false;
  }
}
