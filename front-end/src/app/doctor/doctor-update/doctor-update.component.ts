import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Specialization } from '../../models/enums/specialization';
import { DoctorDtoGet } from '../../models/doctor-dto-get';
import { DoctorService } from '../../services/doctor-services/doctor.service';
import Swal from 'sweetalert2';
import { ClientService } from '../../client/services/client.service';

@Component({
  selector: 'app-doctor-update',
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './doctor-update.component.html',
  styleUrl: './doctor-update.component.scss'
})
export class DoctorUpdateComponent {
  processing = false;
  isLoading = true;
  bloodTypes = Object.values(Specialization);
  membershipLevels = Object.values(Specialization);
  doctor!: DoctorDtoGet;

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
    private localS: LocalStorageManagerService,
    private docService: DoctorService
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {

    this.docService.getProfile().subscribe({
      next: (response) => {
        this.doctor = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  onUpdateProfile() {
    this.processing = true;

    const updatedDoctor = {
      fullName: this.doctor.fullName,
      email: this.doctor.email,
      phoneNumber: this.doctor.phoneNumber,
      dateOfBirth: this.doctor.dateOfBirth,
      medicalLicenseNumber: this.doctor.medicalLicenseNumber,
      specialization: this.doctor.specialization,
      address: this.doctor.address
    }
    this.docService.updateProfile(updatedDoctor, this.doctor.id).subscribe({
      next: (response) => {
        setTimeout(() => {
          console.log('Profile updated successfully:', response);
          Swal.fire({
            title: 'Success',
            text: 'Profile updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          
          this.router.navigate(['/dashboard-doctor']);
          this.processing = false;
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update profile.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        this.processing = false;
      }
    })
  }

  onChangePassword() {
    if (this.passwords.new !== this.passwords.confirm) {
      Swal.fire('New passwords do not match.');
      return;
    }

    this.updatePassprocessing = true;

    this.docService.changePassword({
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    }).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.router.navigate(['/dashboard-doctor']);
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
    this.router.navigate(['/dashboard-doctor']);
  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
}
