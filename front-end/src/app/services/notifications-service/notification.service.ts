import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseUrl = 'http://localhost:8080/notifications';
  constructor(private httpClient: HttpClient) { }

  markAsRead(notificationId: number) {
    return this.httpClient.put(`${this.baseUrl}/mark-as-read/${notificationId}`, null);
  }

  
}
