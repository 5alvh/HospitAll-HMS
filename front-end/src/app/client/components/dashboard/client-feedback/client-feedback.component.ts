import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VisitedDoctorDto } from '../dashboard-client.component';
import Swal from 'sweetalert2';
import { ClientLoadingWrapperComponent } from "../client-loading-wrapper/client-loading-wrapper.component";
import { Feedback } from '../../../../doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorService } from '../../../../services/doctor-services/doctor.service';
import { FeedbackService } from '../../../../services/feedback-service/feedback.service';


export interface FeedbackGetDto {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  type: string;
  doctorName: string | null;
}

@Component({
  selector: 'app-client-feedback',
  imports: [FormsModule, NgFor, NgIf, NgClass, DatePipe, ClientLoadingWrapperComponent],
  templateUrl: './client-feedback.component.html',
  styleUrl: './client-feedback.component.scss'
})

export class ClientFeedbackComponent implements OnInit {

  openModal: boolean = false;
  feedbackToUpdate?: FeedbackGetDto;

  @Input({ required: true }) patientId!: number;
  feedbacks!: FeedbackGetDto[];
  selectedRating: number = 0;
  doctorFeedbackId: number | null = null;
  feedbackDoctors: VisitedDoctorDto[] = [];
  isGeneralFeedback: boolean = true;
  selectedFeedbackType: string = 'general';
  feedbackMessage: string = '';
  hoveredRating: number = 0;
  isLoading: boolean = true;
  selectedFeedback?: FeedbackGetDto;
  noDoctors: boolean = true;
  doctorName: string = '';

  // Modal specific properties
  modalOpen: boolean = false;
  editFeedbackMessage: string = '';
  editSelectedRating: number = 0;
  editHoveredRating: number = 0;
  editFeedbackType: string = 'general';
  editDoctorFeedbackId: number | null = null;
  editIsGeneralFeedback: boolean = true;
  currentEditingFeedbackId: number | null = null;

  constructor(private doctorService: DoctorService, private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.feedbackService.getAllFeedBacks().subscribe(
      (response) => {
        this.feedbacks = response;
        console.log(this.feedbacks);
        this.isLoading = false;
      }
    )

    this.doctorService.getVisitedDoctorByClientId(this.patientId).subscribe({
      next: (doctors) => {
        if (doctors.length > 0) {
          this.noDoctors = false;
        }
        this.feedbackDoctors = doctors;
      },
      error: (error) => {
        console.error('Error fetching visited doctors:', error);
      }
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  onFeedbackTypeChange() {
    this.isGeneralFeedback = !(this.selectedFeedbackType === 'doctor');
  }

  cancelUpdate() {
    this.selectedFeedback = undefined;
  }

  setHover(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHover(): void {
    this.hoveredRating = 0;
  }

  submitFeedback(): void {
    if (this.selectedRating === 0) {
      Swal.fire('Please select a rating before submitting.');
      return;
    }

    if (this.feedbackMessage.trim() === '' || this.feedbackMessage.length < 5) {
      Swal.fire('Please enter a feedback message before submitting.');
      return;
    }
    const feedback = {
      comment: this.feedbackMessage.trim(),
      rating: this.selectedRating,
      writtenToId: this.isGeneralFeedback ? null : this.doctorFeedbackId,
      type: this.isGeneralFeedback ? 'GENERAL' : 'DOCTOR'
    };
    this.feedbackService.submitFeedback(feedback).subscribe({

      next: (response) => {
        console.log(response);
        Swal.fire('Thank you for your feedback!');
        this.feedbacks.push({
          id: response.id,
          patientName: '',
          rating: feedback.rating,
          createdAt: new Date(),
          comment: this.feedbackMessage,
          type: this.selectedFeedbackType,
          doctorName: response.doctorName
        });
        this.feedbackMessage = '';
        this.selectedFeedbackType = 'general';
        this.onFeedbackTypeChange();
      },
      error: () => {
        Swal.fire('There was an error submitting your feedback. Please try again later.');
      }
    });

    this.selectedRating = 0;
    this.hoveredRating = 0;
    this.selectedFeedbackType = '';
  }

  editFeedback(feedbackId: number) {
    this.currentEditingFeedbackId = feedbackId;

    // Fetch feedback by ID
    this.feedbackService.getFeedbackById(feedbackId).subscribe({
      next: (feedback) => {
        this.feedbackToUpdate = feedback;
        this.editFeedbackMessage = feedback.comment;
        this.editSelectedRating = feedback.rating;
        this.editFeedbackType = feedback.type === 'GENERAL' ? 'general' : 'doctor';
        this.editIsGeneralFeedback = feedback.type === 'GENERAL';

        // If it's doctor feedback, find the doctor ID
        if (feedback.type === 'DOCTOR' && feedback.doctorName) {
          const doctor = this.feedbackDoctors.find(d => d.fullName === feedback.doctorName);
          this.editDoctorFeedbackId = doctor ? doctor.id : null;
        } else {
          this.editDoctorFeedbackId = null;
        }

        this.modalOpen = true;
      },
      error: (error) => {
        console.error('Error fetching feedback:', error);
        Swal.fire('Error', 'Could not load feedback details', 'error');
      }
    });
  }

  closeModal() {
    this.modalOpen = false;
    this.editFeedbackMessage = '';
    this.editSelectedRating = 0;
    this.editHoveredRating = 0;
    this.editFeedbackType = 'general';
    this.editDoctorFeedbackId = null;
    this.editIsGeneralFeedback = true;
    this.currentEditingFeedbackId = null;
    this.feedbackToUpdate = undefined;
  }

  onEditFeedbackTypeChange() {
    this.editIsGeneralFeedback = !(this.editFeedbackType === 'doctor');
  }

  setEditRating(rating: number): void {
    this.editSelectedRating = rating;
  }

  setEditHover(rating: number): void {
    this.editHoveredRating = rating;
  }

  clearEditHover(): void {
    this.editHoveredRating = 0;
  }

  updateFeedback(): void {
    if (this.editSelectedRating === 0) {
      Swal.fire('Please select a rating before updating.');
      return;
    }

    if (this.editFeedbackMessage.trim() === '' || this.editFeedbackMessage.length < 5) {
      Swal.fire('Please enter a feedback message before updating.');
      return;
    }

    if (!this.currentEditingFeedbackId) {
      Swal.fire('Error', 'No feedback selected for update', 'error');
      return;
    }

    const updatedFeedback = {
      comment: this.editFeedbackMessage.trim(),
      rating: this.editSelectedRating,
      writtenToId: this.editIsGeneralFeedback ? null : this.editDoctorFeedbackId,
      type: this.editIsGeneralFeedback ? 'GENERAL' : 'DOCTOR'
    };

    this.feedbackService.updateFeedback(this.currentEditingFeedbackId, updatedFeedback).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Feedback updated successfully!', 'success');

        // Update the feedback in the local array
        const index = this.feedbacks.findIndex(f => f.id === this.currentEditingFeedbackId);
        if (index !== -1) {
          this.feedbacks[index] = {
            ...this.feedbacks[index],
            comment: response.comment,
            rating: response.rating,
            type: response.type,
            doctorName: response.doctorName
          };
          console.log("DoctorName:"+ response.doctorName);
          console.log(this.feedbacks[index]);
        }

        this.closeModal();
      },
      error: () => {
        Swal.fire('Error', 'There was an error updating your feedback. Please try again later.', 'error');
      }
    });
  }

  deleteFeedback(feebackId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Know that if you delete your feedback.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedbackService.deleteFeedback(feebackId).subscribe({
          next: () => {
            const index = this.feedbacks.findIndex(feedback => feedback.id === feebackId);
            if (index !== -1) {
              this.feedbacks.splice(index, 1);
            }
            Swal.fire(
              'Deleted!',
              'Your feedback has been deleted.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an issue deleting your feedback.',
              'error'
            );
          }
        });
      }
    });
  }
}