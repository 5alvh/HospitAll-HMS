import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificationStateService } from './notification-state.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseUrl = 'http://localhost:8080/notifications';
  constructor(private httpClient: HttpClient, private notificationState: NotificationStateService) { }

  markAsRead(notificationId: number) {
    return this.httpClient.put(`${this.baseUrl}/mark-as-read/${notificationId}`, null).pipe(
      tap(()=>this.notificationState.refreshUnseenNotificationCount())
    );
  }

  getAllNotifications(): Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/my`);
  }
  
  getTopThree(): Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/top-three`)
  }
}
