import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { AppointmentDtoGet } from '../../../../models/appointment-dto-get';
import { AppointmentService } from '../../../services/appointment.service';
import { FilesGeneratorService } from '../../../../services/shared-services/files-generator.service';
import { AppointmentStatus } from '../../../../models/enums/appointment-status';
import { response } from 'express';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-client-appointments',
  imports: [RouterLink, FormsModule, NgIf, NgFor, ClientLoadingWrapperComponent, NgClass, DatePipe, FontAwesomeModule],
  templateUrl: './client-appointments.component.html',
  styleUrl: './client-appointments.component.scss',
  providers: [DatePipe]
})
export class ClientAppointmentsComponent implements OnInit {

  appointments!: AppointmentDtoGet[];
  selectedAppointment: AppointmentDtoGet | null = null;
  hideCancelled = true;
  pastAppointments: AppointmentDtoGet[] = [];
  upcomingAppointments: AppointmentDtoGet[] = [];
  isLoading: boolean = true;
  clickedTab = 'upcoming';
  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };

  currentPageAU = 0;
  pageSizeAU = 5;
  totalPagesAU = 0;

  currentPageH = 0;
  pageSizeH = 5;
  totalPagesH = 0;

  constructor(private appointmentService: AppointmentService, private filesGenerator: FilesGeneratorService) { }

  nextPageAU() {
    this.currentPageAU++;
    this.loadUpcomingAppointments();
  }
  prevPageAU() {
    this.currentPageAU--;
    this.loadUpcomingAppointments();
  }

  nextPageH() {
    this.currentPageH++;
    this.loadAppointmentsHistory();
  }
  prevPageH() {
    this.currentPageH--;
    this.loadAppointmentsHistory();
  }

  ngOnInit(): void {
    this.loadUpcomingAppointments();
    this.loadAppointmentsHistory();
    this.isLoading = false;
  }

  loadUpcomingAppointments() {
    this.appointmentService.getUpcommingAppointments(this.pageSizeAU, this.currentPageAU, !this.hideCancelled).subscribe(
      (response) => {
        console.log(response)

        this.upcomingAppointments = [];
        this.totalPagesAU = response.totalPages - 1
        response.content.forEach(
          (appointment: AppointmentDtoGet) => {
            this.upcomingAppointments.push({
              ...appointment,
              appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
            });
          }
        )
      }
    )
  }

  loadAppointmentsHistory() {
    this.appointmentService.getAppointmentsHistory(this.pageSizeH, this.currentPageH).subscribe(
      (response) => {
        this.pastAppointments = [];
        this.totalPagesH = response.totalPages - 1
        response.content.forEach(
          (appointment: AppointmentDtoGet) => {
            this.pastAppointments.push({
              ...appointment,
              appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
            }
            )
          }
        )
      }
    )
  }


  downloadAppointment(appointmentId: number) {
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

  sorryMessage() {
    Swal.fire({
      title: "Sorry!",
      text: "Sorry we still didn't implement this feature yet",
      imageUrl: "./cat.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image"
    });
  }

  canBeCancelled(appointmentStatus: AppointmentStatus): boolean {
    return appointmentStatus === AppointmentStatus.SCHEDULED
      || appointmentStatus === AppointmentStatus.CONFIRMED;
  }
  showDetailsAppointment(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate} ${formattedTime}`;
  }

  closeDetails() {
    this.selectedAppointment = null;
  }

  cancelAppointment(appId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Know that if you cancel your appointment, you can't undo it and must request a new one.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.cancelAppointment(appId).subscribe({
          next: () => {
            const index = this.upcomingAppointments.findIndex(appointment => appointment.id === appId);
            this.upcomingAppointments[index].status = AppointmentStatus.CANCELLED;
            Swal.fire(
              'Cancelled!',
              'Your appointment has been cancelled.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an issue cancelling your appointment.',
              'error'
            );
          }
        });
      }
    });
  }
}
