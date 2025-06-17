import { Component, Input, OnInit } from '@angular/core';
import { ClientDtoGet } from '../../../models/client-dto-get';
import { NgIf, TitleCasePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ClientService } from '../../../services/client-services/client.service';

@Component({
  selector: 'app-client-profile',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss',
  providers: [TitleCasePipe],
})
export class ClientProfileComponent implements OnInit {

  patient!: ClientDtoGet;
  isLoading = true;
  constructor(private clientService: ClientService, private router: Router) { }
  
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        this.patient = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.router.navigate(['/']);
        console.error('Error fetching profile:', error);
      }
    });
  }

  onInactivateAccount() {
    if (confirm('Are you sure you want to inactivate your account? This action cannot be undone.')) {
      this.clientService.inactivateAccount().subscribe({
        next: () => {
          alert('Your account has been inactivated successfully.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error inactivating account:', error);
          alert('An error occurred while inactivating your account. Please try again later.');
        }
      });
    }
  }
}
