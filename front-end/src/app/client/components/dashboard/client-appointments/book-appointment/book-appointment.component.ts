import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ClientDtoGet } from '../../../../../models/client-dto-get';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../../../services/shared-services/department.service';
import { ClientService } from '../../../../services/client.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { Router, RouterLink } from '@angular/router';
import { AppointmentType } from '../../../../../models/enums/appointment-type';
import Swal from 'sweetalert2';


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
  selector: 'app-book-appointment',
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
  providers: [DatePipe]
})
export class BookAppointmentComponent {
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
  sameInfos: boolean = true;
  date!: Date;
  isLoading = true;

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
    this.isLoading = false;
  }

  copyInfos(): void {
    //this.sameInfos = !this.sameInfos;
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
    if (this.appointmentForm.invalid) {
      return;
    }

    this.submitting = true;
    const doctorId = this.appointmentForm.get('doctor')!.value;
    const type = AppointmentType.IN_PERSON;
    const reason = this.appointmentForm.get('reasonForVisit')!.value;
    const timeSlot = this.appointmentForm.get('timeSlot')!.value;
      this.appointmentService.bookAppointment({
        doctorId: doctorId,
        date: this.date,
        startTime: timeSlot,
        type: type,
        reason: reason
      }).subscribe({
        next: (appointment) => {
          setTimeout(() => {
            this.submitting = false;
            this.router.navigate(['/dashboard-client']);
          }, 2000);
        },
        error: (error) => {
          Swal.fire('Error booking appointment.');
          this.submitting = false;
        }
      }
      );
  }

  getProfile() {
    this.clientService.getProfile().subscribe({
      next: (response) => {
        this.patient = response;
        this.copyInfos();

      },
      error: (error) => {
        this.router.navigate(['/login']);
        console.error('Error fetching profile:', error);
      }
    });
  }
  resetForm() {
    this.initForm();

    // Reset state variables
    this.submitting = false;
    this.submitted = false;
    this.departmentSelected = false;
    this.prefferedDateChosen = false;
    this.doctorsSearched = false;
    this.slotsSearched = false;
    this.timeSlots = [];
    this.doctors = [];
    this.date = new Date();

    this.copyInfos();
  }
  get f() { return this.appointmentForm.controls; }

}
