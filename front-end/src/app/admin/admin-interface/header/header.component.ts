import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user = {
    name: 'Dr. Maria Andrews',
    role: 'Chief Medical Officer',
    imageUrl: 'https://randomuser.me/api/portraits/women/24.jpg'
  };

  notifications = [
    { icon: 'person', iconColor: 'text-primary-600', text: 'New patient admission: John Doe', time: '5 minutes ago' },
    { icon: 'calendar_today', iconColor: 'text-amber-600', text: 'Staff meeting at 3:00 PM', time: '1 hour ago' },
    { icon: 'medical_services', iconColor: 'text-red-600', text: 'Medicine inventory update required', time: '2 hours ago' }
  ];
}
