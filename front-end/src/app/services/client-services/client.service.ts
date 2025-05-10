import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getProfile(): Observable<ClientDtoGet>{
    return this.httpClient.get<ClientDtoGet>(`${this.baseUrl}/profile`).pipe(
            tap(response => console.log('User:', response))
        );
  }

}
