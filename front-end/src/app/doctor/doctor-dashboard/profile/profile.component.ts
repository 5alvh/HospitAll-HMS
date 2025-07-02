import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DoctorDtoGet } from '../../../models/doctor-dto-get';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { DoctorService } from '../../../services/doctor-services/doctor.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, NgIf, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  doctor!: DoctorDtoGet;
 
  ngOnInit(): void {
    this.loadDoctor();
  }
  constructor(private docService: DoctorService) { }
  loadDoctor() {
    this.isLoading = true;
    this.docService.getProfile().subscribe({
      next: (response) => {
        this.doctor = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
      }
    });
  }

}
