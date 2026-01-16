import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BloodType } from '../../../models/enums/blood-type';
import { AuthService } from '../../../services/auth/auth.service';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { ClientDtoCreate } from '../../../models/client-dto-create';
import { HeaderWelcomeComponent } from "../../../shared/header-welcome/header-welcome.component";

enum MembershipLevel {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
  INSURANCE_COVERED = 'INSURANCE_COVERED'
}

@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.scss'],
  imports: [NgIf, ReactiveFormsModule, NgClass, DatePipe, TitleCasePipe, RouterLink, NgFor, FormsModule],
  providers: [DatePipe, TitleCasePipe]
})
export class ClientSignupComponent implements OnInit {
  currentStep = 1;
  signupForm!: FormGroup;
  membershipLevels = Object.values(MembershipLevel);
  selectedBloodType = 'A_POSITIVE';
  bloodTypes = Object.values(BloodType);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  passwordVisible = false;
  confirmPasswordVisible = false;
  submitted = false;
  submitting = false;

  step1Submitted = false;
  step2Submitted = false;
  step3Submitted = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private localStorageManager: LocalStorageManagerService
  ) {

  }

  ngOnInit(): void {
    this.signupForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({

      personalInfo: this.fb.group({
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\-\\s()]*$')]],
        dateOfBirth: [null, Validators.required],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        bloodType: [this.selectedBloodType, Validators.required],
        membershipLevel: [MembershipLevel.BASIC, Validators.required]
      }),
      securityInfo: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirmation: ['', Validators.required]
      }, { validators: this.passwordMatchValidator }),
      emergencyContact: this.fb.group({
        contactName: ['', Validators.required],
        contactPhone: ['', Validators.required],
        relationship: ['', Validators.required]
      })
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordConfirmation')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  updateEmergencyContactValidators(include: boolean): void {
    const contactName = this.signupForm.get('emergencyContact.contactName');
    const contactPhone = this.signupForm.get('emergencyContact.contactPhone');

    if (include) {
      contactName?.setValidators([Validators.required, Validators.maxLength(100)]);
      contactPhone?.setValidators([Validators.required, Validators.pattern('^\\+?[0-9\\-\\s()]*$')]);
    } else {
      contactName?.clearValidators();
      contactPhone?.clearValidators();
    }

    contactName?.updateValueAndValidity();
    contactPhone?.updateValueAndValidity();
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.step1Submitted = true;
      if (!this.personalInfo.valid) {
        this.markGroupAsTouched(this.personalInfo);
        return;
      }
    }

    if (this.currentStep === 2) {
      this.step2Submitted = true;
      if (!this.securityInfo.valid) {
        this.markGroupAsTouched(this.securityInfo);
        return;
      }
    }


    this.currentStep++;
  }

  prevStep(): void {
    this.currentStep--;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  markGroupAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markGroupAsTouched(control);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.step3Submitted = true;
    if (this.signupForm.invalid) {
      this.markGroupAsTouched(this.signupForm);
      return;
    }
    // Form submission logic

    const formValue = this.signupForm.value;
    const clientData: ClientDtoCreate = {
      fullName: formValue.personalInfo.fullName,
      email: formValue.personalInfo.email,
      phoneNumber: formValue.personalInfo.phoneNumber,
      dateOfBirth: formValue.personalInfo.dateOfBirth,
      membershipLevel: formValue.personalInfo.membershipLevel,
      address: formValue.personalInfo.address, // NEW
      bloodType: formValue.personalInfo.bloodType,


      password: formValue.securityInfo.password,
      passwordConfirmation: formValue.securityInfo.passwordConfirmation,

      emergencyContact: formValue.emergencyContact
    };

    console.log(clientData)
    this.register(clientData)

  }

  // Helper getters for form groups
  get personalInfo(): FormGroup {
    return this.signupForm.get('personalInfo') as FormGroup;
  }

  get securityInfo(): FormGroup {
    return this.signupForm.get('securityInfo') as FormGroup;
  }

  get emergencyContact(): FormGroup {
    return this.signupForm.get('emergencyContact') as FormGroup;
  }

  register(clientData: ClientDtoCreate) {
    this.submitting = true;
    this.authService.registerClient(clientData).subscribe({
      next: response => {
        console.log('Client signup data:', clientData);
        const role = response.role;
        this.localStorageManager.setToken(response.token);
        this.localStorageManager.setUserData(role);
        this.router.navigate(['/login']);
        this.submitting = false;
      },
      error: error => {
        this.submitting = false;
        console.error('Error registering client:', error);
      }
    })
  }

  get f() {
    return {
      fullName: this.personalInfo.get('fullName'),
      email: this.personalInfo.get('email'),
      phoneNumber: this.personalInfo.get('phoneNumber'),
      address: this.personalInfo.get('address'),
      bloodType: this.personalInfo.get('bloodType'),
      dateOfBirth: this.personalInfo.get('dateOfBirth'),
      password: this.securityInfo.get('password'),
      passwordConfirmation: this.securityInfo.get('passwordConfirmation'),
      contactName: this.emergencyContact.get('contactName'),
      contactPhone: this.emergencyContact.get('contactPhone')
    };
  }
}