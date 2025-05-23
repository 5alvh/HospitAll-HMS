import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DepartmentDto } from '../../models/department';
export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl: string = 'http://localhost:8080/departments';

  constructor(private httpClient: HttpClient) { }

  getDepartments():Observable<DepartmentDto[]> {
    return this.httpClient.get<DepartmentDto[]>(`${this.baseUrl}/all`).pipe(
      // tap(response => console.log('Departments:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
  
    // Safely check for ErrorEvent in case it's undefined (e.g. Node/Vite)
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
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
