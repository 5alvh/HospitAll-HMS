import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabResultsService {

  constructor(private hhtp: HttpClient) { }

  createLabResults(postRequest: any) { 
    return this.hhtp.post('http://localhost:8080/lab-results', postRequest);
  }
}
