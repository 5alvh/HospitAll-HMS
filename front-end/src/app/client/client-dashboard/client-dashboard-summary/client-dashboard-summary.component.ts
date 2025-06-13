import { Component, Input, OnInit, output, Output } from '@angular/core';
import { ClientDtoGet } from '../../../models/client-dto-get';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { EventEmitter } from 'stream';
import { NotificationService } from '../../../services/client-services/notification.service';
import { NotificationDto } from '../../../models/notification-dto';
import { AppointmentDtoGet } from '../../../models/appointment-dto-get';

@Component({
  selector: 'app-client-dashboard-summary',
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './client-dashboard-summary.component.html',
  styleUrl: './client-dashboard-summary.component.scss',
  providers: [DatePipe]
})
export class ClientDashboardSummaryComponent implements OnInit {
  @Input({ required: true }) patient!: ClientDtoGet;
  @Input({ required: true }) medications!: any;
  @Input({ required: true }) notifications!: NotificationDto[];
  @Input({ required: true }) upcomingAppointments: AppointmentDtoGet[] = [];
  hideCancelled = true;

  get filteredUpcomingAppointments() {
    return this.hideCancelled
      ? this.upcomingAppointments.filter(a => a.status !== 'CANCELLED')
      : this.upcomingAppointments;
  }
  topUnseenNotifications: NotificationDto[] = [];

  //@Output() sectionChange!: EventEmitter<string>;
  sectionChange = output<string>();

  constructor(private notificationsService: NotificationService) { }
  ngOnInit(): void {
    this.refreshTopUnseenNotifications()
  }

  setActiveSection(section: string) {
    this.sectionChange.emit(section)
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
    this.refreshTopUnseenNotifications();
  }
  refreshTopUnseenNotifications() {
    this.topUnseenNotifications = this.notifications.filter(n => !n.seen).slice(0, 3);
  }

}
