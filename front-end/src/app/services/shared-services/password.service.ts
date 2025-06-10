import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  baseUrl = 'http://localhost:8080/auth';
  constructor(private httpClient: HttpClient) { }

  forgetPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/forgot-password`, {email});
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/reset-password`, {token, newPassword, confirmPassword});
  }
}
