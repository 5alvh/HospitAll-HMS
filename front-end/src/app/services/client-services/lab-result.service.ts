import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';

@Injectable({
  providedIn: 'root'
})
export class LabResultService {

  baseUrl = 'http://localhost:8080/lab-results'
  constructor(private httpClient: HttpClient) { }

  getAllLabResults(): Observable<LabResultDtoGet[]>{
    return this.httpClient.get<LabResultDtoGet[]>(`${this.baseUrl}/all-lab-results`)
  }
}
