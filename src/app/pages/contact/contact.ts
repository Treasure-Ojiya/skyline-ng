import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  submitted = false;
  formError = false;

  form = { name: '', email: '', subject: '', message: '' };

  contactInfo = [
    { icon: '📧', label: 'Email', value: 'support@skyline.com' },
    { icon: '📞', label: 'Phone', value: '+234 800 SKY LINE' },
    { icon: '📍', label: 'Address', value: 'Victoria Island, Lagos, Nigeria' },
    { icon: '🕐', label: 'Hours', value: 'Mon – Fri, 8am – 6pm WAT' },
  ];

  onSubmit() {
    this.formError = false;
    const { name, email, subject, message } = this.form;
    if (!name || !email || !subject || !message) {
      this.formError = true;
      return;
    }
    // In a real app this would hit an API. For now just show success.
    this.submitted = true;
    this.form = { name: '', email: '', subject: '', message: '' };
  }
}
