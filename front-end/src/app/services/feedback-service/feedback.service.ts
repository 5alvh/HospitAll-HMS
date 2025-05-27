import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseUrl = 'http://localhost:8080/feedback';
  constructor(private httpClient: HttpClient) { }

  submitFeedback(feedback: any) {
    return this.httpClient.post(`${this.baseUrl}/create`, feedback);
  }
}
