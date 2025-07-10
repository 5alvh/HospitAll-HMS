import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PrescriptionStatus } from '../../../models/enums/prescription-status';
import { DoctorService } from '../../../services/doctor-services/doctor.service';
import Swal from 'sweetalert2';
import { MedicalPrescriptionDtoGet } from '../../../models/medical-prescription-dto-get';
import { MedicalPrescriptionDtoUpdate, prescriptionRequest } from '../doctor-dashboard.component';
import { FilesGeneratorService } from '../../../services/shared-services/files-generator.service';
import { FormsModule } from '@angular/forms';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-prescriptions',
  imports: [NgIf, NgFor, NgClass, DatePipe, FormsModule, NgClass, FontAwesomeModule],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss',
  providers: [DatePipe]
})
export class PrescriptionsComponent implements OnInit {

  prescriptions!: any[];
  selectedPrescription: MedicalPrescriptionDtoUpdate | null = null;
  isEditModalOpen: boolean = false;
  totalElements: number = 0
  newPrescription: prescriptionRequest = {
    searchType: 'id',
    patientIdentifier: '',
    medications: [{ medicationName: '', dosage: '', frequency: '', duration: '', notes: '' }],
    appointmentId: 0,
    status: ''
  };

  icons = {
      chevronLeft: faChevronLeft,
      chevronRight: faChevronRight,
    };
    
  currentPage: number = 0;
  totalPages: number = 0;
  size: number = 10;
  search = '';

  previousPage() {
    this.currentPage--;
    this.loadPrescriptions();

  }
  nextPage() {
    this.currentPage++;
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.docService.getMedicalPrescriptions(this.currentPage, this.size, this.search).subscribe(
      (response) => {
        console.log(response)
        this.totalPages = response.totalPages-1;
        this.prescriptions = response.content;
        this.totalElements = response.totalElements
      },
      (error) => {
        console.log("error")
      }
    )
  }
  constructor(private docService: DoctorService, private filesGenerator: FilesGeneratorService) { }
  ngOnInit(): void {
    this.loadPrescriptions();
  }

  downloadPrescription(prescriptionId: number) {
    this.filesGenerator.getMedicalPrescriptionPdf(prescriptionId).subscribe({
      next: (pdfBlob: Blob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `appointment_${prescriptionId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('PDF download failed:', err);
      }
    });
  }


  updatePrescription(): void {
    if (this.selectedPrescription) {
      this.docService.updatePrescription(this.selectedPrescription).subscribe({
        next: (res) => {
          console.log('Prescription updated successfully.');
          Swal.fire({
            title: 'Success',
            text: 'Prescription updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        },
        error: (error) => {
          console.error('Error updating prescription:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to update prescription.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      })
    }
    this.closeModal();
  }

  isPublished(prescription: any): boolean {
    return prescription.status === PrescriptionStatus.PUBLISHED;
  }
  closeModal(): void {
    this.selectedPrescription = null;
    this.isEditModalOpen = false;
  }
  getPublishedPrescriptions(): any[] {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.PUBLISHED);
  }

  getDraftPrescriptions(): any[] {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.DRAFT);
  }

  getConnectedAppointment(prescriptionId: number): any {
    const prescription = this.prescriptions.find(p => p.id === prescriptionId);
    return null;
  }

  deletePrescription(prescriptionId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this prescription?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.docService.deletePrescription(prescriptionId).subscribe({
          next: () => {
            this.prescriptions = this.prescriptions.filter(prescription => prescription.id !== prescriptionId);
            //this.calculateDashboardStats();
            Swal.fire({
              title: 'Success',
              text: 'Prescription deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (error) => {
            console.error('Error deleting prescription:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete prescription. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    })

  }


  publishPrescription(id: number): void {

    if (id !== null) {
      this.docService.publishPrescription(id).subscribe({
        next: (response) => {
          const prescription = this.prescriptions.find(prescription => prescription.id === id);
          if (prescription !== null) {
            prescription!.status = PrescriptionStatus.PUBLISHED;
          }
          //this.calculateDashboardStats();
          this.refreshPrescriptionsForm();

          Swal.fire({
            title: 'Success',
            text: 'Prescription published successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          console.error('Error publishing prescription:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to publish prescription. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })

    }
  }

  refreshPrescriptionsForm(): void {
    this.newPrescription = {
      searchType: 'id',
      patientIdentifier: '',
      medications: [{ medicationName: '', dosage: '', frequency: '', duration: '', notes: '' }],
      appointmentId: 0,
      status: ''
    };
  }

  openEditModal(prescription: MedicalPrescriptionDtoGet): void {
    this.selectedPrescription = {
      id: prescription.id,
      medicationName: prescription.medicationName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      startDate: prescription.startDate,
      duration: this.getDateDifferenceInDays(prescription.startDate, prescription.endDate),
      notes: prescription.notes,
      prescribedEmail: prescription.clientEmail
    };
    this.isEditModalOpen = true;
    console.log(prescription.startDate + " " + prescription.endDate)
  }

  private getDateDifferenceInDays(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Aseguramos que ambas fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const msInOneDay = 1000 * 60 * 60 * 24;
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInMs / msInOneDay);

    return diffInDays;
  }
}
