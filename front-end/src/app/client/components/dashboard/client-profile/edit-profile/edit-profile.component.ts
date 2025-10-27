import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ClientDtoUpdate } from '../../../../../models/client-dto-update';
import { ClientService } from '../../../../services/client.service';
import { Router } from '@angular/router';
import { ClientDtoGet } from '../../../../../models/client-dto-get';
import { BloodType } from '../../../../../models/enums/blood-type';
import { MembershipLevel } from '../../../../../models/enums/membership-level';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  imports: [NgIf, FormsModule, TitleCasePipe, NgFor],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  providers: [TitleCasePipe]
})
export class EditProfileComponent {
  disableEditButton = true;
  disableEditButton2 = true; 
  disableEditButton3 = true;

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };
  activeSection = 'basic';
  patient!: ClientDtoGet;
  processing = false;
  isLoading = true;
  bloodTypes = Object.values(BloodType);
  membershipLevels = Object.values(MembershipLevel);


  onFormChanged() {
    this.disableEditButton = false;
  }

  onForm2Changed() {
    this.disableEditButton2 = false;
  }

  onForm3Changed() {
    this.disableEditButton3 = false;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }
  updatePassprocessing: boolean = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('Available blood types:', this.bloodTypes);

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
          this.clientService.setPatient(response);
          this.processing = false;
          this.router.navigate(['/dashboard-client']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        Swal.fire('Error updating profile.');
        this.processing = false;
      }
    });
  }

  onChangePassword() {
    if (this.passwords.new !== this.passwords.confirm) {
      Swal.fire('New passwords do not match.');
      return;
    }

    this.updatePassprocessing = true;

    this.clientService.changePassword({
      currentPassword: this.passwords.current,
      newPassword: this.passwords.new
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard-client']);
        this.updatePassprocessing = false;
      },
      error: (error) => {
        Swal.fire('The old password is incorrect, please try again.');
        this.updatePassprocessing = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard-client/profile']);
  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

}
