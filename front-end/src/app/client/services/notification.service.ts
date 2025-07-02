import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAllNotifications(size: number, page: number): Observable<any>{
    let params = new HttpParams()
    .set('size',size)
    .set('page',page)
    return this.httpClient.get(`${this.baseUrl}/my`,{params});
  }
  
  getTopThree(): Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/top-three`)
  }
}
