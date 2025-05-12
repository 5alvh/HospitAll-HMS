import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-update',
  imports: [FormsModule, NgIf],
  templateUrl: './client-update.component.html',
  styleUrl: './client-update.component.scss'
})
export class ClientUpdateComponent {
  
  patient!: ClientDtoGet;
  isLoading: boolean = true;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
  }
  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        console.log('User:', response);
        this.patient = response;
        this.isLoading = false;
      }
    });
  }
  onSubmit(): void {
    console.log('Form submitted');
  }

  goBack() {
    this.router.navigate(['/dashboard-client']);
  }

  onUpdateProfile() {
    throw new Error('Method not implemented.');
  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
}
