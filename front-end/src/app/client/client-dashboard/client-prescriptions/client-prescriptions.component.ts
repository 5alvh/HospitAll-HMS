import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MedicalPrescriptionDtoGet } from '../../../models/medical-prescription-dto-get';
import Swal from 'sweetalert2';
import { LabResultDtoGet } from '../../../models/lab-result-dto-get';
import { FilesGeneratorService } from '../../../services/shared-services/files-generator.service';
import { PrescriptionService } from '../../../services/client-services/prescription.service';
import { response } from 'express';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { LabResultService } from '../../../services/client-services/lab-result.service';

@Component({
  selector: 'app-client-prescriptions',
  imports: [NgIf, NgFor, DatePipe, ClientLoadingWrapperComponent],
  templateUrl: './client-prescriptions.component.html',
  styleUrl: './client-prescriptions.component.scss',
  providers: [DatePipe]
})
export class ClientPrescriptionsComponent implements OnInit {

  medications!: MedicalPrescriptionDtoGet[];
  labResults!: LabResultDtoGet[];
  selectedPrescription: MedicalPrescriptionDtoGet | null = null;
  isLoadingPrescriptions: boolean = true;
  isLoadingLabResults: boolean = true;

  constructor(private filesGenerator: FilesGeneratorService, private prescriptionService: PrescriptionService, private labResultService: LabResultService) { }
 
  ngOnInit(): void {
    this.prescriptionService.getAllPrescriptions().subscribe(
      (response) => {
        this.medications = response;
        this.isLoadingPrescriptions = false;
      }
    )
    this.labResultService.getAllLabResults().subscribe(
      (response)=>{
        this.labResults = response;
      }
    )
  }

  sorryMessage() {
    Swal.fire({
      title: "Sorry!",
      text: "Sorry we still didn't implement this feature yet",
      imageUrl: "./cat.jpg",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image"
    });
  }
  closeDetails() {
    this.selectedPrescription = null;
  }
  showDetailsPrescription(prescription: MedicalPrescriptionDtoGet) {
    this.selectedPrescription = prescription;
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
}
