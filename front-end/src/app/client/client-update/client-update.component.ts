import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ClientDtoGet } from '../../models/client-dto-get';
import { ClientService } from '../../services/client-services/client.service';
import { Router } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { BloodType } from '../../models/enums/blood-type';
import { ClientDtoUpdate } from '../../models/client-dto-update';
import { MembershipLevel } from '../../models/enums/membership-level';

@Component({
  selector: 'app-client-update',
  imports: [FormsModule, ReactiveFormsModule, NgIf, TitleCasePipe, NgFor],
  templateUrl: './client-update.component.html',
  styleUrl: './client-update.component.scss',
  providers: [TitleCasePipe],
  encapsulation: ViewEncapsulation.None

})
export class ClientUpdateComponent {
  patient!: ClientDtoGet;
  processing = false;
  isLoading = true;
  bloodTypes = Object.values(BloodType);
  membershipLevels = Object.values(MembershipLevel);

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  updatePassprocessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private localS: LocalStorageManagerService
  ) { }

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
        console.error('Error fetching user profile:', error);
        this.router.navigate(['/']);
        this.isLoading = false;
      }
    });
  }

  onUpdateProfile() {
    this.processing = true;

    const updatedClient: ClientDtoUpdate = {
      fullName: this.patient.fullName,
      email: this.patient.email,
      phoneNumber: this.patient.phoneNumber,
      dateOfBirth: this.patient.dateOfBirth,
      membershipLevel: this.patient.membershipLevel,
      emergencyContact: this.patient.emergencyContact,
      address: this.patient.address,
      bloodType: this.patient.bloodType,
    };
    this.clientService.updateProfile(updatedClient, this.patient.id).subscribe({
      next: (response) => {
        setTimeout(() => {
          console.log('Profile updated successfully:', response);
          this.clientService.setPatient(response);
          this.router.navigate(['/dashboard-client']);
          this.processing = false;
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.processing = false;
      }
    });
  }

  onChangePassword() {
    if (this.passwords.new !== this.passwords.confirm) {
      alert('New passwords do not match.');
      return;
    }

    this.updatePassprocessing = true;

    this.clientService.changePassword({
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    }).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.router.navigate(['/dashboard-client']);
        this.updatePassprocessing = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        alert('Failed to change password.');
        this.updatePassprocessing = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard-client']);
  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
}
