import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationDto } from '../../../../models/notification-dto';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-client-notifications',
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './client-notifications.component.html',
  styleUrl: './client-notifications.component.scss'
})
export class ClientNotificationsComponent implements OnInit {

  notifications!: NotificationDto[];

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  isLoading = false;
  constructor(private notificationsService: NotificationService) { }
  ngOnInit(): void {
    this.loadNotifications();
  }
  loadNotifications() {
    this.notificationsService.getAllNotifications(this.pageSize, this.currentPage).subscribe(
      (response) => {
        console.log(response.content)
        this.totalPages = response.totalPages;
        this.notifications = [...(this.notifications || []), ...response.content];
      }
    )
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
    //this.refreshTopUnseenNotifications();
  }

  loadMore(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.currentPage++;
      this.loadNotifications();
      this.isLoading = false;
    }, 500)

  }

}
