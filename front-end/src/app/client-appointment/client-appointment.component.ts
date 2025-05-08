import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor  } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DepartmentsService } from '../services/shared-service/departments.service';
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

interface Department {
  id: number;
  name: string;
  /*description: string;
  headDoctor: string;
  contactNumber: string;
  location: string;
  version: number;
  updatedAt: Date;
  createdAt: Date;*/
}

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}
@Component({
  selector: 'app-client-appointment',
  imports: [ReactiveFormsModule, NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './client-appointment.component.html',
  styleUrl: './client-appointment.component.scss',
  providers: [DatePipe]
})
export class ClientAppointmentComponent {
  appointmentForm!: FormGroup;
  departments: Department[] = [];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  timeSlots: TimeSlot[] = [];
  availableDates: Date[] = [];
  minDate = new Date();
  maxDate = new Date(this.minDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
  submitting = false;
  submitted = false;
  appointmentSuccess = false;
  
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    this.generateAvailableDates();
    
    // Watch for department changes to filter doctors
    this.appointmentForm.get('department')!.valueChanges.subscribe(departmentId => {
      this.filterDoctors(departmentId);
      this.appointmentForm.get('doctor')!.setValue(null);
      this.appointmentForm.get('date')!.setValue(null);
      this.appointmentForm.get('timeSlot')!.setValue(null);
    });
    
    // Watch for doctor changes to update available time slots
    this.appointmentForm.get('doctor')!.valueChanges.subscribe(() => {
      this.appointmentForm.get('date')!.setValue(null);
      this.appointmentForm.get('timeSlot')!.setValue(null);
    });
    
    // Watch for date changes to update time slots
    this.appointmentForm.get('date')!.valueChanges.subscribe(date => {
      if (date) {
        this.loadTimeSlots();
        this.appointmentForm.get('timeSlot')!.setValue(null);
      }
    });
  }
  
  initForm(): void {
    this.appointmentForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      department: [null, Validators.required],
      doctor: [null, Validators.required],
      date: [null, Validators.required],
      timeSlot: [null, Validators.required],
      reasonForVisit: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      isNewPatient: [false]
    });
  }
  
  loadDepartments(): void {
    /*this.departmentsService.getDepartments().subscribe((departments: any) => {
      this.departments = departments;
    })*/
    this.departments = [
      { id: 1, name: 'Cardiology' },
      { id: 2, name: 'Neurology' },
      { id: 3, name: 'Orthopedics' },
      { id: 4, name: 'Pediatrics' },
      { id: 5, name: 'Dermatology' }
    ];
    
    // Mock doctors data
    this.doctors = [
      { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology', available: true },
      { id: 2, name: 'Dr. Michael Chen', specialization: 'Cardiology', available: true },
      { id: 3, name: 'Dr. Robert Smith', specialization: 'Neurology', available: true },
      { id: 4, name: 'Dr. Amanda Lee', specialization: 'Neurology', available: false },
      { id: 5, name: 'Dr. James Wilson', specialization: 'Orthopedics', available: true },
      { id: 6, name: 'Dr. Emily Brown', specialization: 'Pediatrics', available: true },
      { id: 7, name: 'Dr. David Taylor', specialization: 'Dermatology', available: true }
    ];
  }
  
  filterDoctors(departmentId: number): void {
    const department = this.departments.find(d => d.id === departmentId);
    if (department) {
      this.filteredDoctors = this.doctors.filter(
        doctor => doctor.specialization === department.name && doctor.available
      );
    } else {
      this.filteredDoctors = [];
    }
  }
  
  generateAvailableDates(): void {
    // Generate dates for the next 30 days, excluding weekends
    const dates: Date[] = [];
    const today = new Date();
    const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(new Date(d));
      }
    }
    
    this.availableDates = dates;
  }
  
  loadTimeSlots(): void {
    // Simulate API call to get available time slots for selected doctor and date
    this.timeSlots = [
      { id: 1, time: '09:00 AM', available: true },
      { id: 2, time: '09:30 AM', available: true },
      { id: 3, time: '10:00 AM', available: false },
      { id: 4, time: '10:30 AM', available: true },
      { id: 5, time: '11:00 AM', available: true },
      { id: 6, time: '11:30 AM', available: true },
      { id: 7, time: '01:00 PM', available: true },
      { id: 8, time: '01:30 PM', available: false },
      { id: 9, time: '02:00 PM', available: true },
      { id: 10, time: '02:30 PM', available: true },
      { id: 11, time: '03:00 PM', available: true },
      { id: 12, time: '03:30 PM', available: false }
    ];
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.appointmentForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    // Simulate API call to book appointment
    setTimeout(() => {
      this.submitting = false;
      this.appointmentSuccess = true;
      console.log('Appointment booked:', this.appointmentForm.value);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    }, 1500);
  }
  
  resetForm(): void {
    this.submitted = false;
    this.appointmentSuccess = false;
    this.appointmentForm.reset();
    this.appointmentForm.patchValue({
      isNewPatient: false
    });
  }
  
  // Helper getters for form controls
  get f() { return this.appointmentForm.controls; }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'EEEE, MMMM d, y')!;
  }
  
  isDateAvailable(date: Date): boolean {
    // This would typically be determined by backend availability data
    // For demo purposes, all weekdays are available
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  }
}
