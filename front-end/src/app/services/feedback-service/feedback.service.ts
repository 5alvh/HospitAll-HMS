import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../../doctor/doctor-dashboard/doctor-dashboard.component';
import { FeedbackGetDto } from '../../client/components/dashboard/client-feedback/client-feedback.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseUrl = 'http://localhost:8080/feedback';
  constructor(private httpClient: HttpClient) { }

  updateFeedback(id: number, feedback: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/edit-feedback/${id}`, feedback);
  }
  getFeedbackById(id: number): Observable<FeedbackGetDto> {
    return this.httpClient.get<FeedbackGetDto>(`${this.baseUrl}/by-id/${id}`);
  }
  submitFeedback(feedback: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create`, feedback);
  }

  getAllFeedBacks(): Observable<FeedbackGetDto[]>{
    return this.httpClient.get<FeedbackGetDto[]>(`${this.baseUrl}/my`)
  }

  deleteFeedback(id: number){
    return this.httpClient.delete(`${this.baseUrl}/delete/${id}`)
  }
}
