import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDtoCreate } from '../../models/client-dto-create';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private baseUrlClients = 'http://localhost:8080/clients';
  private baseUrlDoctors = 'http://localhost:8080/doctors';
  constructor(private httpClient: HttpClient) { }

  registerClient(data: ClientDtoCreate): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrlClients}/register`, data)
      .pipe(
        tap(response => console.log('Client registered successfully:', response)),
        catchError(this.handleError)
      );
  }

  registerDoctor(data: ClientDtoCreate) {
    return this.httpClient.post(`${this.baseUrlDoctors}/register`, data);
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

}
