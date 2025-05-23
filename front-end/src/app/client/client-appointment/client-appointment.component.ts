import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/shared-services/department.service';
import { ClientService } from '../../services/client-services/client.service';
import { ClientDtoGet } from '../../models/client-dto-get';
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
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './client-appointment.component.html',
  styleUrl: './client-appointment.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class ClientAppointmentComponent {
  dateStepEnabled: boolean = false;
  departmentSelected = false;
  doctorsSearched = false;
  dateSearched = false;
  patient!: ClientDtoGet;
  appointmentForm!: FormGroup;
  departments: Department[] = [];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  timeSlots: TimeSlot[] = [];
  availableDates: Date[] = [];
  minDate = new Date();
  maxDate = new Date(this.minDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  submitting = false;
  submitted = false;
  appointmentSuccess = false;
  sameInfos: boolean = false;
  onDepartmentChange() {
    this.departmentSelected = !!this.appointmentForm.get('department')!.value;
    this.doctorsSearched = false;
    this.dateSearched = false;
    this.filteredDoctors = [];

    this.appointmentForm.get('doctor')!.reset();
    this.appointmentForm.get('date')!.reset();
    this.appointmentForm.get('timeSlot')!.reset();
    this.appointmentForm.get('reasonForVisit')!.reset();
  }
  searchDoctors() {
    console.log('Searching doctors...');
    /* const deptId = this.appointmentForm.get('department')!.value;
     // Call your API or service here to get doctors for selected department:
     this.doctorService.getDoctorsByDepartment(deptId).subscribe(doctors => {
       this.filteredDoctors = doctors;
       this.doctorsSearched = true;
       this.dateSearched = false;
       this.appointmentForm.get('doctor')!.reset();
       this.appointmentForm.get('date')!.reset();
       this.appointmentForm.get('timeSlot')!.reset();
       this.appointmentForm.get('reasonForVisit')!.reset();
     });*/
  }

  searchDate() {
    // You could implement logic to filter available time slots for the chosen doctor and date here
    this.dateSearched = true;

    // Reset time slot and reason fields
    this.appointmentForm.get('timeSlot')!.reset();
    this.appointmentForm.get('reasonForVisit')!.reset();

    // Optionally fetch available time slots based on selected doctor and date here
  }


  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private departmentsService: DepartmentService,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    this.generateAvailableDates();
    this.getProfile();
    this.appointmentForm.get('department')!.valueChanges.subscribe(departmentId => {
      this.filterDoctors(departmentId);
      this.appointmentForm.get('doctor')!.setValue(null);
      this.appointmentForm.get('date')!.setValue(null);
      this.appointmentForm.get('timeSlot')!.setValue(null);
    });

    this.appointmentForm.get('doctor')!.valueChanges.subscribe(() => {
      this.appointmentForm.get('date')!.setValue(null);
      this.appointmentForm.get('timeSlot')!.setValue(null);
    });

    this.appointmentForm.get('date')!.valueChanges.subscribe(date => {
      if (date) {
        this.loadTimeSlots();
        this.appointmentForm.get('timeSlot')!.setValue(null);
      }
    });
  }

  copyInfos(): void {
    this.sameInfos = !this.sameInfos;
    console.log('Same Infos:', this.sameInfos);
    if (this.sameInfos) {
      this.appointmentForm.patchValue({
        patientName: this.patient.fullName,
        patientEmail: this.patient.email,
        patientPhone: this.patient.phoneNumber
      });
    } else {
      this.appointmentForm.patchValue({
        patientName: '',
        patientEmail: '',
        patientPhone: ''
      });
    }
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
    this.departmentsService.getDepartments().subscribe((departments: any) => {
      this.departments = departments;
    });
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

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        console.log('User:', response);
        this.patient = response;
      },
      error: (error) => {
        this.router.navigate(['/login']);
        console.error('Error fetching profile:', error);
      }
    });
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

  isDateAvailable(date: Date): boolean {
    // This would typically be determined by backend availability data
    // For demo purposes, all weekdays are available
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }


  get f() { return this.appointmentForm.controls; }

}
