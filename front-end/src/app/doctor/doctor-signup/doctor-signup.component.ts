import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Specialization } from '../../models/enums/specialization';
import { Department } from '../../models/department';
import { AuthService } from '../../services/auth/auth.service';
import { DepartmentsService } from '../../services/shared-services/departments.service';
import { WorkingHours } from '../../models/working-hours';
import { DoctorDtoCreate } from '../../models/doctor-dto-create';


@Component({
  selector: 'app-doctor-signup',
  imports: [NgIf, ReactiveFormsModule, NgClass, DatePipe, TitleCasePipe, RouterLink, NgFor],
  templateUrl: './doctor-signup.component.html',
  styleUrl: './doctor-signup.component.scss',
  providers: [DatePipe, TitleCasePipe]
})
export class DoctorSignupComponent {
  signupForm!: FormGroup;
  specializations = Object.values(Specialization);
  departments: Department[] = [];
  maxDate = new Date(); // Today's date as max date
  submitted = false;
  processing = false;
  signupSuccess = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentsService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();

    // Watch for available status in working hours
    this.workingHoursArray.controls.forEach((control: AbstractControl) => {
      control.get('available')?.valueChanges.subscribe(available => {
        if (available) {
          control.get('startTime')?.setValidators([Validators.required]);
          control.get('endTime')?.setValidators([Validators.required]);
        } else {
          control.get('startTime')?.clearValidators();
          control.get('endTime')?.clearValidators();
        }
        control.get('startTime')?.updateValueAndValidity();
        control.get('endTime')?.updateValueAndValidity();
      });
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\-\\s()]*$')]],
      dateOfBirth: [null],
      medicalLicenseNumber: ['', [Validators.required]],
      departmentId: [null, [Validators.required]],
      specialization: [null],
      workingHours: this.fb.array(this.initWorkingHours())
    }, {
      validators: this.passwordMatchValidator
    });
  }

  initWorkingHours(): FormGroup[] {
    const daysOfWeek = 7;
    const workingHours: FormGroup[] = [];

    for (let i = 0; i < daysOfWeek; i++) {
      workingHours.push(
        this.fb.group({
          dayOfWeek: [i],
          available: [false],
          timeIntervals: this.fb.array([])
        })
      );
    }

    return workingHours;
  }

  // Custom validator to check if password and confirmation match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirmation');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  // Custom validator to check if end time is after start time
  timeValidator(control: AbstractControl): ValidationErrors | null {
    const available = control.get('available')?.value;
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (available && startTime && endTime) {
      if (startTime >= endTime) {
        return { endTimeAfterStart: true };
      }
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  getDayName(dayIndex: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex];
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      const firstElementWithError = document.querySelector('.ng-invalid');
      if (firstElementWithError) {
        firstElementWithError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.processing = true;

    // Prepare doctor data
    const formValue = this.signupForm.value;

    // Filter working hours to include only records where available is true
    const filteredWorkingHours = formValue.workingHours.map((day: any, i: number) => {
      if (!day.available) return null;

      return {
        dayOfWeek: this.getDayName(i).toUpperCase(),
        timeIntervals: day.timeIntervals
      };
    }).filter(Boolean);


    const doctorData: DoctorDtoCreate = {
      fullName: formValue.fullName,
      email: formValue.email,
      hashedPassword: formValue.password,
      passwordConfirmation: formValue.passwordConfirmation,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      medicalLicenseNumber: formValue.medicalLicenseNumber,
      departmentId: formValue.departmentId,
      specialization: formValue.specialization,
      workingHours: filteredWorkingHours
    };

    this.authService.registerDoctor(doctorData).subscribe({
      next: response => {
        setTimeout(() => {
          console.log('Doctor signup data:', doctorData);
          this.processing = false;
          this.signupSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }, 1500);
      },
      error: error => {
        console.error('Error registering doctor:', error);
        this.processing = false;
      }
    });
  }

  // Helper getters for form controls
  get f() { return this.signupForm.controls; }
  get workingHoursArray(): FormArray {
    return this.signupForm.get('workingHours') as FormArray;
  }
  getTimeIntervalsArray(dayIndex: number): FormArray {
    return this.workingHoursArray.at(dayIndex).get('timeIntervals') as FormArray;
  }
  addTimeInterval(dayIndex: number): void {
    const interval = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }, { validators: this.timeValidator });

    this.getTimeIntervalsArray(dayIndex).push(interval);
  }

  removeTimeInterval(dayIndex: number, intervalIndex: number): void {
    this.getTimeIntervalsArray(dayIndex).removeAt(intervalIndex);
  }
}
