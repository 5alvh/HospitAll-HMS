import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor-services/doctor.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-feedback',
  imports: [DatePipe, NgIf, NgFor, DecimalPipe],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {

  constructor(private doctorService: DoctorService, private statsService: StatsService) { }

  isLoading = true;
  feedbacks!: any[];
  dashboardStats: any ;

  ngOnInit(): void {
    this.statsService.loadStats();
    this.statsService.sharedStats$.subscribe((stats) => {
      this.dashboardStats = stats;
    });

    this.doctorService.getMyFeedback().subscribe(
      (response) => {
        this.isLoading = false;

        this.feedbacks = response
      },
      (error) => {

      }
    )
  }

  getRatingCount(rating: number): number {
    return this.feedbacks.filter(f => f.rating === rating).length;
  }
  getRatingPercentage(rating: number): number {
    const count = this.feedbacks.filter(f => f.rating === rating).length;
    return this.feedbacks.length > 0 ? (count / this.feedbacks.length) * 100 : 0;
  }
}
