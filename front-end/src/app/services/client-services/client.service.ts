import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ClientDtoGet } from '../../models/client-dto-get';
import { ErrorResponse } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/clients';
  constructor(private httpClient: HttpClient) { }

  

  getProfile(): Observable<ClientDtoGet> {
  return this.httpClient.get<ClientDtoGet>(`${this.baseUrl}/profile`).pipe(
    catchError((error) => {
      if (error.status === 403) {
        console.error('Access denied. Redirecting to login...');
        // Redirect to login page
        window.location.href = '/login'; // Or use Angular Router
      }
      return throwError(() => error);
    })
  );
}
}
