import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ClientDtoGet } from '../../models/client-dto-get';
import { Router } from '@angular/router';
import { LocalStorageManagerService } from '../auth/local-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/clients';
  constructor(private httpClient: HttpClient, private router: Router, private localStorageManager: LocalStorageManagerService) { }



  getProfile(): Observable<ClientDtoGet> {
    return this.httpClient.get<ClientDtoGet>(`${this.baseUrl}/profile`).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
        return throwError(() => "IDK WHY THIS IS AN error"); //TODO: handle error
      })
    );
  }

  inactivateAccount(): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/inactivateAccount`, null).pipe(
      tap(() => {
        this.localStorageManager.clearAuth();
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Error inactivating account:', error);
        return throwError(() => error);
      })
    );
  }
}
