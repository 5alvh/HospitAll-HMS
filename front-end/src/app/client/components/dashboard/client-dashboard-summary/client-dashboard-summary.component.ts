import { Component, OnInit, output, Output } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { RouterLink } from '@angular/router';
import { NotificationDto } from '../../../../models/notification-dto';
import { AppointmentDtoGet } from '../../../../models/appointment-dto-get';
import { NotificationService } from '../../../services/notification.service';
import { ClientService } from '../../../services/client.service';
import { ClientStateService } from '../../../services/client-state.service';

@Component({
  selector: 'app-client-dashboard-summary',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, ClientLoadingWrapperComponent, NgClass, RouterLink],
  templateUrl: './client-dashboard-summary.component.html',
  styleUrl: './client-dashboard-summary.component.scss',
  providers: [DatePipe]
})
export class ClientDashboardSummaryComponent implements OnInit {

  fullName!: string;
  medications!: any;
  notifications!: NotificationDto[];
  upcomingAppointments: AppointmentDtoGet[] = [];
  hideCancelled = true;
  isLoading = true;

  get filteredUpcomingAppointments() {
    return this.hideCancelled
      ? this.upcomingAppointments.filter(a => a.status !== 'CANCELLED')
      : this.upcomingAppointments;
  }

  constructor(private notificationsService: NotificationService, private clientService: ClientService, private clientState: ClientStateService
  ) { }

  ngOnInit(): void {
    this.getSummary();
    this.clientState.fullName$.subscribe((response)=>{
      this.fullName = response.fullName
    } 
    )
  }

  getNotificationIcon(type: string) {
  switch(type.toLowerCase()) {
    case 'appointment':
      return 'fa-solid fa-calendar-check';
    case 'medical_prescription':
      return 'fa-solid fa-file-prescription';
    case 'lab_result':
      return 'fa-solid fa-vials';
    case 'updated':
      return 'fa-solid fa-pen-to-square';
    case 'diagnosis':
      return 'fa-solid fa-notes-medical';
    default:
      return 'fa-solid fa-circle-exclamation';
  }
}

  getSummary() {
    this.clientService.getSummary().subscribe({
      next: (response) => {
        this.medications = response.prescriptions
        this.notifications = response.notifications
        this.upcomingAppointments = response.appointments.map(
          (appointment) => ({
            ...appointment,
            appointmentDateTime: this.formatDate(appointment.appointmentDateTime)
          })
        );
        this.isLoading = false;
      },
      error: (err) => console.error("Error fetching summary:", err)
    });
  }

  formatDate(dateString: string): string {
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
  markAsRead(id: number) {
    const notifInArray = this.notifications.find(n => n.id === id)!;
    notifInArray.seen = true;
    this.notificationsService.markAsRead(id).subscribe({
      next: () => {
        this.notificationsService.getTopThree().subscribe((response)=>{
          this.notifications = response;
        }
        )
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }
}
