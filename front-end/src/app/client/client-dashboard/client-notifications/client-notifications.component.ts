import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationDto } from '../../../models/notification-dto';
import { NotificationService } from '../../../services/client-services/notification.service';
import { response } from 'express';

@Component({
  selector: 'app-client-notifications',
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './client-notifications.component.html',
  styleUrl: './client-notifications.component.scss'
})
export class ClientNotificationsComponent implements OnInit{

  notifications!: NotificationDto[];


  constructor(private notificationsService: NotificationService){}
  ngOnInit(): void {
    this.notificationsService.getAllNotifications().subscribe(
      (response)=>{
        this.notifications = response;
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
}
