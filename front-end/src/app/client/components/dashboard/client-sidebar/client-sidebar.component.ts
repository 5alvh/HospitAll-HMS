import { Component, OnInit } from '@angular/core';
import {NavigationEnd, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-client-sidebar',
  imports: [RouterLink],
  templateUrl: './client-sidebar.component.html',
  styleUrl: './client-sidebar.component.scss'
})
export class ClientSidebarComponent implements OnInit {
  activeSection: string = '';

  sections = [
    { section: 'summary', icon: 'fas fa-home', route: '/dashboard-client/summary' },
    { section: 'profile', icon: 'fas fa-user', route: '/dashboard-client/profile' },
    { section: 'appointments', icon: 'fas fa-calendar-alt', route: '/dashboard-client/appointments' },
    { section: 'records', icon: 'fas fa-file-medical', route: '/dashboard-client/records' },
    { section: 'notifications', icon: 'fas fa-file-invoice-dollar', route: '/dashboard-client/notifications' },
    { section: 'documents', icon: 'fas fa-file-download', route: '/dashboard-client/documents' },
    { section: 'feedback', icon: 'fas fa-comment-dots', route: '/dashboard-client/feedback' },
    { section: 'support', icon: 'fas fa-question-circle', route: '/dashboard-client/support' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setActiveSectionFromUrl(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setActiveSectionFromUrl(event.urlAfterRedirects);
    });
  }

  private setActiveSectionFromUrl(url: string) {
    const pathSegment = url.split('/')[2];
    this.activeSection = pathSegment || 'summary';
  }
}