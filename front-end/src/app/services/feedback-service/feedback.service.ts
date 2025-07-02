import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../../doctor/doctor-dashboard/doctor-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseUrl = 'http://localhost:8080/feedback';
  constructor(private httpClient: HttpClient) { }

  submitFeedback(feedback: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create`, feedback);
  }

  getAllFeedBacks(): Observable<Feedback[]>{
    return this.httpClient.get<Feedback[]>(`${this.baseUrl}/my`)
  }

  deleteFeedback(id: number){
    return this.httpClient.delete(`${this.baseUrl}/delete/${id}`)
  }
}
