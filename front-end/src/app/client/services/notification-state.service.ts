import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { NotificationUnseenService } from './notification-unseen.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {


  notificationSubject = new BehaviorSubject<number>(0);
  unseenNotificationsCount = toSignal(this.notificationSubject.asObservable());

  constructor(private notif: NotificationUnseenService){}
  setNotificationCount(count: number) {
    this.notificationSubject.next(count)
  }

  refreshUnseenNotificationCount() {
    this.notif.getUnseenNotificationsCount().subscribe(
      (response) => {
        this.setNotificationCount(response);
      }
    )
  }

  
}
