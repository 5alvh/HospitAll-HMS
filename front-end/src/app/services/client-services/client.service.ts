import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ClientDtoGet } from '../../models/client-dto-get';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/clients';
  constructor(private httpClient: HttpClient, private router: Router) { }

  

  getProfile(): Observable<ClientDtoGet> {
  return this.httpClient.get<ClientDtoGet>(`${this.baseUrl}/profile`).pipe(
    catchError((error) => {
      if (error.status === 403) {
        console.error('Access denied. Redirecting to login...');
        this.router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
}
