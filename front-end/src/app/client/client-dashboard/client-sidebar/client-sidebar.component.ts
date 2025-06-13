import { Component, output } from '@angular/core';

@Component({
  selector: 'app-client-sidebar',
  imports: [],
  templateUrl: './client-sidebar.component.html',
  styleUrl: './client-sidebar.component.scss'
})
export class ClientSidebarComponent {
  activeSection: string = 'dashboard'

  changeActiveSection = output<string>();

  setActiveSection(section: string) {
    this.activeSection = section;
    this.changeActiveSection.emit(section)
  }

  sections = [
    {
      section: 'dashboard',
      icon: 'fas fa-home'
    },
    {
      section: 'profile',
      icon: 'fas fa-user'
    },
    {
      section: 'appointments',
      icon: 'fas fa-calendar-alt'
    },
    {
      section: 'records',
      icon: 'fas fa-file-medical'
    },
    {
      section: 'notifications',
      icon: 'fas fa-file-invoice-dollar'
    },
    {
      section: 'documents',
      icon: 'fas fa-file-download'
    },
    {
      section: 'feedback',
      icon: 'fas fa-comment-dots'
    },
    {
      section: 'support',
      icon: 'fas fa-question-circle'
    }
  ]
}
