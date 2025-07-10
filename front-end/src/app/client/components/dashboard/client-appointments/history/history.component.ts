import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment.service';
import { FilesGeneratorService } from '../../../../../services/shared-services/files-generator.service';
import { AppointmentDtoGet } from '../../../../../models/appointment-dto-get';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-history',
  imports: [NgIf, NgFor, FontAwesomeModule, NgClass, DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  providers: [DatePipe]
})
export class HistoryComponent implements OnInit {

  pastAppointments: AppointmentDtoGet[] = [];

  isLoading: boolean = true;

  currentPageH = 0;
  pageSizeH = 5;
  totalPagesH = 0;
  selectedAppointment: AppointmentDtoGet | null = null;

  ngOnInit(): void {
    console.log("ara lhwa hada");
    this.loadAppointmentsHistory();

  }
  closeDetails() {
    this.selectedAppointment = null;
  }

  constructor(private appointmentService: AppointmentService, private filesGenerator: FilesGeneratorService) { }
  loadAppointmentsHistory() {
    this.appointmentService.getAppointmentsHistory(this.pageSizeH, this.currentPageH).subscribe(
      (response) => {
        this.pastAppointments = [];
        if (response == null) {
          this.isLoading = false;
          return;
        }
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
        this.isLoading = false;
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
  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };
  showDetailsAppointment(appointment: AppointmentDtoGet) {
    this.selectedAppointment = appointment;
  }

  nextPageH() {
    this.currentPageH++;
    this.loadAppointmentsHistory();
  }
  prevPageH() {
    this.currentPageH--;
    this.loadAppointmentsHistory();
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
