import { NgIf } from '@angular/common';
import { Component, computed, Input, OnInit, output, signal } from '@angular/core';
import { LocalStorageManagerService } from '../../../services/auth/local-storage-manager.service';
import { Router, RouterLink } from '@angular/router';
import { ClientStateService } from '../../../services/client-services/client-state.service';
import { ClientService } from '../../../services/client-services/client.service';
import { NotificationService } from '../../../services/client-services/notification.service';
import { NotificationStateService } from '../../../services/client-services/notification-state.service';

@Component({
  selector: 'app-client-header',
  imports: [NgIf, RouterLink],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent implements OnInit {

  unreadNotificationsCount: any =  signal<number>;
  patientName!: string;
  showOptions = false;
  titles = ['Your Hospital Dashboard', 'Caring for You, Every Step of the Way'];
  titleIndex = 0;
  title = this.titles[this.titleIndex];
  fadeState = 'visible';
  intervalId: any;

  constructor(private notifStateService: NotificationStateService, private localS: LocalStorageManagerService, private router: Router, private clientState: ClientStateService) {
  }

  ngOnInit(): void {
    
    this.notifStateService.refreshUnseenNotificationCount();
    this.unreadNotificationsCount = this.notifStateService.unseenNotificationsCount;
    
    this.clientState.getFullName();
    this.clientState.fullName$.subscribe(
      (response) => {
        this.patientName = response.fullName
      }
    )

    this.intervalId = setInterval(() => {
      this.fadeState = 'hidden';

      setTimeout(() => {
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        this.title = this.titles[this.titleIndex];
        this.fadeState = 'visible';
      }, 1000);
    }, 6000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  
  onShowOptions() {
    this.showOptions = !this.showOptions;
  }

  logout() {
    this.localS.clearAuth();
    this.router.navigate(['/']);
    console.log('Logging out...');
  }
}
