import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationUnseenService {
  baseUrl = 'http://localhost:8080/notifications';

  constructor(private httpClient: HttpClient) { }

  getUnseenNotificationsCount(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/unseen/count`)
  }
}
