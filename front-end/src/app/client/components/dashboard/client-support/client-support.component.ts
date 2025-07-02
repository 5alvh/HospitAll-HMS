import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-client-support',
  imports: [NgFor],
  templateUrl: './client-support.component.html',
  styleUrl: './client-support.component.scss'
})
export class ClientSupportComponent {


  activeIndex: number | null = null;

  toggleAnswer(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  faqs = [
    {
      question: 'How do I schedule an appointment?',
      answer: 'You can schedule an appointment through the "Appointments" section. Select "Book New", choose your department, doctor, and preferred date, then check available slots and book your appointment.'
    },
    {
      question: 'How can I access my medical records?',
      answer: 'Your medical records can be accessed in the "Medical Records" section. You can view your prescriptions, lab results, medical history, and vaccination records.'
    },
    {
      question: 'How do I pay my bills online?',
      answer: 'You can pay your bills through the "Billing" section. Select the invoice you wish to pay and click "Pay Now" to be directed to our secure payment gateway.'
    },
    {
      question: 'How do I start a telemedicine consultation?',
      answer: 'Navigate to the "Telemedicine" section, where you can schedule a video consultation or start a chat with healthcare providers.'
    }
  ];
}
