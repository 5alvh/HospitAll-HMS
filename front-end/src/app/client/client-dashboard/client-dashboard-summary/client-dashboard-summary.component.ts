import { Component, Input, OnInit, output, Output } from '@angular/core';
import { ClientDtoGet } from '../../../models/client-dto-get';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NotificationService } from '../../../services/client-services/notification.service';
import { NotificationDto } from '../../../models/notification-dto';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';
import { ClientService } from '../../../services/client-services/client.service';

@Component({
  selector: 'app-client-dashboard-summary',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './client-dashboard-summary.component.html',
  styleUrl: './client-dashboard-summary.component.scss',
  providers: [DatePipe]
})
export class ClientDashboardSummaryComponent implements OnInit {
  fullName!: string;
  medications!: any;
  notifications!: NotificationDto[];
  upcomingAppointments: AppointmentDtoGet[] = [];
  sectionChange = output<string>();
  hideCancelled = true;
  isLoading = true;

  get filteredUpcomingAppointments() {
    return this.hideCancelled
      ? this.upcomingAppointments.filter(a => a.status !== 'CANCELLED')
      : this.upcomingAppointments;
  }


  constructor(private notificationsService: NotificationService, private clientService: ClientService) { }
  ngOnInit(): void {
    this.getSummary();
  }

  getSummary() {
    this.clientService.getSummary().subscribe({
      next: (response) => {
        this.fullName = response.fullName
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
  setActiveSection(section: string) {
    this.sectionChange.emit(section)
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
        console.log('Notification marked as read successfully.');
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }
}
