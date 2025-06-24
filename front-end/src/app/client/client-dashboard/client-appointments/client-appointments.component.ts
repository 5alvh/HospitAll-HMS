import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentStatus } from '../../../models/enums/appointment-status';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';
import { AppointmentService } from '../../../services/client-services/appointment.service';
import { FilesGeneratorService } from '../../../services/shared-services/files-generator.service';
import { response } from 'express';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";

@Component({
  selector: 'app-client-appointments',
  imports: [RouterLink, FormsModule, NgIf, NgFor, ClientLoadingWrapperComponent, NgClass,DatePipe],
  templateUrl: './client-appointments.component.html',
  styleUrl: './client-appointments.component.scss',
  providers:[DatePipe]
})
export class ClientAppointmentsComponent implements OnInit {

  appointments!: AppointmentDtoGet[];
  selectedAppointment: AppointmentDtoGet | null = null;
  hideCancelled = true;
  pastAppointments: AppointmentDtoGet[] = [];
  upcomingAppointments: AppointmentDtoGet[] = [];
  isLoading: boolean= true;
  clickedTab = 'upcoming';

  constructor(private appointmentService: AppointmentService, private filesGenerator: FilesGeneratorService) { }

  ngOnInit(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (response) => {
        this.appointments = response;
        if (this.appointments) {
          this.appointments.forEach(appointment => {

            const appointmentDate = new Date(appointment.appointmentDateTime);
            const now = new Date();

            if (appointmentDate >= now) {
              this.upcomingAppointments.push({
                ...appointment,
                appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
              });
            } else {
              this.pastAppointments.push({
                ...appointment,
                appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
              });
            }
          });
        }
        this.isLoading = false;
      }
    )
  }

  get filteredUpcomingAppointments() {
    return this.hideCancelled
      ? this.upcomingAppointments.filter(a => a.status !== 'CANCELLED')
      : this.upcomingAppointments;
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
