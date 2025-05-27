import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/shared-services/department.service';
import { ClientService } from '../../services/client-services/client.service';
import { ClientDtoGet } from '../../models/client-dto-get';
import { AppointmentService } from '../../services/client-services/appointment.service';
import { AppointmentType } from '../../models/enums/appointment-type';
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

interface Department {
  id: number;
  name: string;
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

  prefferedDateChosen: boolean = false;
  departmentSelected = false;
  doctorsSearched = false;
  slotsSearched = false;
  patient!: ClientDtoGet;
  appointmentForm!: FormGroup;
  departments: Department[] = [];
  doctors: { doctorFullName: string, doctorId: number }[] = [];
  timeSlots: TimeSlot[] = [];
  availableDates: Date[] = [];
  minDate = new Date();
  maxDate = new Date(this.minDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  submitting = false;
  submitted = false;
  appointmentSuccess = false;
  sameInfos: boolean = false;
  date!: Date;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private departmentsService: DepartmentService,
    private clientService: ClientService,
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  onDepartmentChange() {
    this.departmentSelected = !!this.appointmentForm.get('department')!.value;
    this.prefferedDateChosen = false;
    this.doctorsSearched = false;
    this.slotsSearched = false;
  }

  searchDoctors() {
    const departmentId = this.appointmentForm.get('department')!.value;
    const date = this.appointmentForm.get('date')!.value;
    this.appointmentService.getAvailableDoctors(departmentId, date)
      .subscribe((doctors: any) => {
        this.doctors = doctors;
        this.doctorsSearched = true;
      },
      );
  }

  onDateChange(): void {
    if (this.appointmentForm.get('date')!.value) {
      this.prefferedDateChosen = true;
      this.date = this.appointmentForm.get('date')!.value;
    } else {
      this.prefferedDateChosen = false;
    }
    this.doctorsSearched = false;
    this.slotsSearched = false;
  }

  onDoctorChange() {
    this.slotsSearched = false;
  }
  searchSlots() {

    const doctorId = this.appointmentForm.get('doctor')!.value;

    this.appointmentService.getAvailableSlots(doctorId, this.date).subscribe((slots: any) => {
      this.timeSlots = slots.map((slot: any) => ({
        id: slot.id,
        time: this.datePipe.transform(new Date('1970-01-01T' + slot.startTime + 'Z'), 'HH:mm'),
        available: true
      }));
      this.slotsSearched = true;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    this.getProfile();
  }

  copyInfos(): void {
    this.sameInfos = !this.sameInfos;
    if (this.sameInfos) {
      this.appointmentForm.patchValue({
        patientName: this.patient.fullName,
        patientEmail: this.patient.email,
        patientPhone: this.patient.phoneNumber
      });
      this.appointmentForm.get('patientName')?.disable();
      this.appointmentForm.get('patientEmail')?.disable();
      this.appointmentForm.get('patientPhone')?.disable();
    } else {
      this.appointmentForm.get('patientName')?.enable();
      this.appointmentForm.get('patientEmail')?.enable();
      this.appointmentForm.get('patientPhone')?.enable();
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
    });
  }

  loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe((departments: any) => {
      this.departments = departments;
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.appointmentForm.invalid) {
      return;
    }

    setTimeout(() => {
      this.submitting = true;
      const doctorId = this.appointmentForm.get('doctor')!.value;
      const type = AppointmentType.IN_PERSON;
      const reason = this.appointmentForm.get('reasonForVisit')!.value;
      const timeSlot = this.appointmentForm.get('timeSlot')!.value;
      setTimeout(() => {
        this.appointmentService.bookAppointment({
          doctorId: doctorId,
          date: this.date,
          startTime: timeSlot,
          type: type,
          reason: reason
        }).subscribe({
          next: (appointment) => {
            this.submitting = false;
            this.appointmentSuccess = true;
            console.log('Appointment booked successfully:', appointment);
            this.router.navigate(['/dashboard-client']);
          },
          error: (error) => {
            this.submitting = false;
            console.error('Error booking appointment:', error);
            this.appointmentSuccess = false;
          }
        }
        );
      }, 3000);
    }, 1500);
  }

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        this.patient = response;
      },
      error: (error) => {
        this.router.navigate(['/login']);
        console.error('Error fetching profile:', error);
      }
    });
  }

  get f() { return this.appointmentForm.controls; }

}
