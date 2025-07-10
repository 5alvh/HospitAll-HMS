import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { AppointmentService } from '../../../../services/appointment.service';
import { FilesGeneratorService } from '../../../../../services/shared-services/files-generator.service';
import { AppointmentDtoGet } from '../../../../../models/appointment-dto-get';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppointmentStatus } from '../../../../../models/enums/appointment-status';

@Component({
  selector: 'app-upcoming',
  imports: [NgFor, NgIf, FontAwesomeModule, FormsModule, NgClass, DatePipe],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.scss'
})
export class UpcomingComponent implements OnInit {

  upcomingAppointments: AppointmentDtoGet[] = [];
  isLoading: boolean = true;
  selectedAppointment: AppointmentDtoGet | null = null;

  currentPageAU = 0;
  pageSizeAU = 5;
  totalPagesAU = 0;
  constructor(private appointmentService: AppointmentService, private filesGenerator: FilesGeneratorService) { }

  ngOnInit(): void {
    this.loadUpcomingAppointments();
  }

  loadUpcomingAppointments() {
    this.appointmentService.getUpcommingAppointments(this.pageSizeAU, this.currentPageAU, !this.hideCancelled).subscribe(
      (response) => {
        console.log("response", response)

        this.upcomingAppointments = [];
        if (response != null) {
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

        this.isLoading = false;
      }
    )
  }


  nextPageAU() {
    this.currentPageAU++;
    this.loadUpcomingAppointments();
  }
  prevPageAU() {
    this.currentPageAU--;
    this.loadUpcomingAppointments();
  }

  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };

  hideCancelled = true;

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

  showDetailsAppointment(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }

  closeDetails() {
    this.selectedAppointment = null;
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
}
