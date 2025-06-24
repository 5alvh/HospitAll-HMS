import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResultDtoGet } from '../../models/lab-result-dto-get';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LabResultService {

  labResultUrl = `${environment.baseUrl}lab-results`

  constructor(private httpClient: HttpClient) { }

  getAllLabResults(): Observable<LabResultDtoGet[]>{
    return this.httpClient.get<LabResultDtoGet[]>(`${this.labResultUrl}/my`)
  }

}
