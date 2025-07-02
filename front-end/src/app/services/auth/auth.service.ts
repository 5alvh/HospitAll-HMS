import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDtoCreate } from '../../models/client-dto-create';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { DoctorDtoCreate } from '../../models/doctor-dto-create';
import { LocalStorageManagerService } from './local-storage-manager.service';

export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrlClients = 'http://localhost:8080/clients';
  private baseUrlDoctors = 'http://localhost:8080/doctors';
  private baseUrlLogin = 'http://localhost:8080/auth/login';
  constructor(private httpClient: HttpClient, private localStorageManager: LocalStorageManagerService) { }

  registerClient(data: ClientDtoCreate): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrlClients}/register`, data)
      .pipe(
        tap(response => console.log('Client registered successfully:', response)),
        catchError(this.handleError)
      );
  }

  registerDoctor(data: DoctorDtoCreate): Observable<any> {
    return this.httpClient.post(`${this.baseUrlDoctors}/register`, data)
      .pipe(
        tap(response => console.log('Doctor registered successfully:', response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 409) {
        errorMessage = 'User already exists with this email address';
      } else if (error.status === 400) {
        const serverError = error.error as ErrorResponse;
        errorMessage = serverError.message || 'Validation error occurred';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrlLogin}`, { email, password, rememberMe })
      .pipe(
        tap((response) => {
          this.localStorageManager.setToken(response.token);
          this.localStorageManager.setUserData(response.role);
        }),
        catchError(this.handleError)
      );
  }
  isAuthenticated(): boolean {
    const token = this.localStorageManager.getToken();
    if (!token) return false;
    return true
    // Optionally, decode JWT to check expiry
    //const decoded = this.decodeToken(token);
    //return decoded && decoded.exp * 1000 > Date.now();
  }

}
