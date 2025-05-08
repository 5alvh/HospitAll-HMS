import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private baseUrl = 'http://localhost:8080/departments';

  constructor(private httpClient: HttpClient) { }

  
}
