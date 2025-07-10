import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faUser,
  faPrescriptionBottle,
  faFlask,
  faPlus,
  faSave,
  faTimes,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faChartDiagram,
  faEdit,
  faPhone,
  faChartLine,
  faPrint,
  faPills,
  faStethoscope,
  faAllergies,
  faFileMedical,
  faInfoCircle,
  faCalendar,
  faLocationDot,
  faEnvelope,
  faIdCard,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { DoctorService } from '../../../../services/doctor-services/doctor.service';
import { BookAppRequest, prescriptionRequest } from '../../doctor-dashboard.component';
import { PrescriptionStatus } from '../../../../models/enums/prescription-status';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../../../client/services/appointment.service';
import { LabResultService } from '../../../../client/services/lab-result.service';
import { LabResultsService } from '../../../services/lab-results.service';

@Component({
  selector: 'app-patient-details',
  imports: [NgIf, DatePipe, NgFor, FontAwesomeModule, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss',
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class PatientDetailsComponent implements OnInit {

  @Input({ required: true }) userId!: number;
  @Input({ required: true }) selectedUser!: any;
  activeTab: 'prescriptions' | 'appointments' | 'labResults' = 'prescriptions';

  // Forms Visibility
  showPrescriptionForm = false;
  showAppointmentForm = false;
  showLabResultForm = false;

  // Form Groups
  prescriptionForm: FormGroup;
  appointmentForm: FormGroup;
  labResultForm: FormGroup;

  // Sample Data
  prescriptions: any[] = [];
  appointments: any[] = [];
  labResults: any[] = [];

  goBackEvent = output();
  icons = {
    search: faSearch,
    user: faUser,
    prescription: faPrescriptionBottle,
    appointment: faCalendarAlt,
    lab: faFlask,
    plus: faPlus,
    close: faTimes,
    save: faSave,
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
    envelope: faEnvelope,
    phone: faPhone,
    location: faLocationDot,
    idCard: faIdCard,
    calendar: faCalendar,
    heart: faHeart,
    info: faInfoCircle,
    medical: faFileMedical,
    allergy: faAllergies,
    condition: faStethoscope,
    medication: faPills,
    print: faPrint,
    edit: faEdit,
    chart: faChartLine,
    download: faDownload
  };

  constructor(private fb: FormBuilder,
    private doctorService: DoctorService,
    private appService: AppointmentService,
    private labResultsService: LabResultsService
  ) {

    // Initialize forms
    this.prescriptionForm = this.fb.group({
      medications: this.fb.array([this.createMedicationForm()])
    });

    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required],
    });

    this.labResultForm = this.fb.group({
      testName: ['', Validators.required],
      resultValue: ['', Validators.required],
      unit:['', Validators.required],
      referenceRange: ['', Validators.required],
      resultDate: [Date.now()],
      status: ['normal', Validators.required],
      notes: ['']
    });
  }

  private createMedicationForm(): FormGroup {
    return this.fb.group({
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      notes: ['']
    });
  }

  get medications(): FormArray {
    return this.prescriptionForm.get('medications') as FormArray;
  }

  removeMedication(index: number): void {
    if (this.medications.length > 1) {
      this.medications.removeAt(index);
    }
  }

  // Medication management
  addMedication(): void {
    this.medications.push(this.createMedicationForm());
  }

  goBack() {
    this.goBackEvent.emit();
  }

  ngOnInit(): void {
    this.loadUserData(this.userId);
    this.activeTab = 'prescriptions';
    this.resetForms();
  }

  setActiveTab(tab: 'prescriptions' | 'appointments' | 'labResults'): void {
    this.activeTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.showPrescriptionForm = false;
    this.showAppointmentForm = false;
    this.showLabResultForm = false;
    this.prescriptionForm.reset();
    this.appointmentForm.reset({ status: 'scheduled' });
    this.labResultForm.reset({ status: 'normal' });
  }


  addPrescription(): void {
    console.log();
    if (this.prescriptionForm.valid) {
      const newPrescription: prescriptionRequest = {
        clientId: this.selectedUser.id,
        medications: this.prescriptionForm.value.medications,
        status: PrescriptionStatus.PUBLISHED
      };
      this.resetForms();

      this.doctorService.createPrescription(newPrescription).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success',
            text: 'Prescription created successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error creating prescription:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to create prescription. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
    }
  }

  addAppointment(): void {

    if (this.appointmentForm.valid) {
      const newAppointment: BookAppRequest = {
        patientId: this.selectedUser.id,
        date: this.appointmentForm.value.date,
        startTime: this.appointmentForm.value.time,
        reason: this.appointmentForm.value.reason
      };

      this.appService.bookAppointmentByDoctorUsingClientId(newAppointment).subscribe({
        next: (response) => {
          console.log("response"+response)
          this.appointments.push(response);
          this.resetForms();
          Swal.fire({
            title: 'Success',
            text: 'Appointment booked successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error booking appointment:', error);

          Swal.fire({
            title: 'Error',
            text: 'Failed to book appointment. Please try again later. Check if the patient ID is valid.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
      return;
    }
  }

  addLabResult(): void {
    if (this.labResultForm.valid) {
      const postRequest ={
        patientId: this.selectedUser.id,
        testName: this.labResultForm.value.testName,
        resultValue: this.labResultForm.value.resultValue,
        unit: this.labResultForm.value.unit,
        referenceRange: this.labResultForm.value.referenceRange,
        resultDate: this.labResultForm.value.resultDate,
        status: this.labResultForm.value.status,
        notes: this.labResultForm.value.notes
      }

      this.labResultsService.createLabResults(postRequest).subscribe({
        next: (response) => {
          this.labResults = [response, ...this.labResults];
          this.resetForms();
          Swal.fire({
            title: 'Success',
            text: 'Lab result added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error adding lab result:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to add lab result. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })

      const newLabResult = {
        ...this.labResultForm.value,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      this.labResults = [newLabResult, ...this.labResults];
      this.resetForms();
    }
  }

  loadUserData(userId: number): void {
    this.doctorService.getPatientById(userId).subscribe((response) => {
      this.prescriptions = response.prescriptionsReceived;
      this.appointments = response.appointments;
      this.labResults = response.labResultsReceived;
      console.log(response)
    })
  }
}
