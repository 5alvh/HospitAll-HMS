import { NgIf } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-header',
  imports: [NgIf],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent implements OnInit {


  @Input({ required: true }) unreadNotificationsCount!: number;
  @Input({ required: true }) patientName!: string;
  activeSection = output<string>();

  showOptions = false;
  titles = ['Your Hospital Dashboard', 'Caring for You, Every Step of the Way'];
  titleIndex = 0;
  title = this.titles[this.titleIndex];
  fadeState = 'visible'; // 'visible' or 'hidden'
  intervalId: any;
  constructor(private localS: LocalStorageManagerService, private router: Router) { }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.fadeState = 'hidden';

      setTimeout(() => {
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        this.title = this.titles[this.titleIndex];
        this.fadeState = 'visible';
      }, 1000); // Match with fade out duration
    }, 6000); // Every 3 seconds
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  onShowOptions() {
    this.showOptions = !this.showOptions;
  }

  setActiveSection(section: string) {
    this.activeSection.emit(section)
  }

  logout() {
    this.localS.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');
  }
}
