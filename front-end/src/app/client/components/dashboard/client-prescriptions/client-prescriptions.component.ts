import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { FormsModule } from '@angular/forms';
import { MedicalPrescriptionDtoGet } from '../../../../models/medical-prescription-dto-get';
import { LabResultDtoGet } from '../../../../models/lab-result-dto-get';
import { FilesGeneratorService } from '../../../../services/shared-services/files-generator.service';
import { PrescriptionService } from '../../../services/prescription.service';
import { LabResultService } from '../../../services/lab-result.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-client-prescriptions',
  imports: [NgIf, NgFor, DatePipe, ClientLoadingWrapperComponent, FormsModule, FontAwesomeModule],
  templateUrl: './client-prescriptions.component.html',
  styleUrl: './client-prescriptions.component.scss',
  providers: [DatePipe]
})
export class ClientPrescriptionsComponent implements OnInit {
  nextPage() {
    this.currentPage++;
    this.loadPrescriptions();
  }
  prevPage() {
    this.currentPage--;
    this.loadPrescriptions();
  }

  nextPageLR() {
    this.currentPageLR++;
    this.loadPrescriptions();
  }
  prevPageLR() {
    this.currentPageLR--;
    this.loadPrescriptions();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    clearTimeout(this.searchBouncer);
    this.searchBouncer = setTimeout(() => {
      this.loadPrescriptions();
    }, 1000)

  }
  icons = {
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight,
  };

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  searchBouncer: any;

  currentPageLR = 0;
  pageSizeLR = 5;
  totalPagesLR = 0;

  medications: MedicalPrescriptionDtoGet[] = [];
  labResults: LabResultDtoGet[] = [];
  selectedPrescription: MedicalPrescriptionDtoGet | null = null;
  isLoadingPrescriptions: boolean = true;
  isLoadingLabResults: boolean = true;
  labResultFilter: string = 'all';
  activeTab: string = 'prescriptions'

  constructor(private filesGenerator: FilesGeneratorService, private prescriptionService: PrescriptionService, private labResultService: LabResultService) { }

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadLabresults();
  }

  loadPrescriptions() {
    this.prescriptionService.getAllPrescriptions(this.searchTerm, this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.medications = response.content || [];
        this.totalPages = response.totalPages - 1;
        this.isLoadingPrescriptions = false;
      }
    )
  }
  loadLabresults(){
    this.labResultService.getAllLabResults(this.currentPageLR, this.pageSizeLR).subscribe(
      (response) => {
        this.labResults = response.content || [];
        this.totalPagesLR = response.totalPages-1;
        this.isLoadingLabResults = false;
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
