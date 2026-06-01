import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  values = [
    {
      icon: '',
      title: 'Transparency',
      description: 'No hidden fees, no surprises. What you see is exactly what you pay.',
    },
    {
      icon: '⚡',
      title: 'Speed',
      description: 'Book a flight in under 2 minutes. We respect your time.',
    },
    {
      icon: '🤝',
      title: 'Reliability',
      description: 'Your bookings are safe. We save everything securely so nothing is ever lost.',
    },
    {
      icon: '🌱',
      title: 'Accessibility',
      description: 'Built for everyone — whether you travel once a year or every week.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We are always improving our platform to make your experience better.',
    },
    {
      icon: '❤️',
      title: 'Customer First',
      description: 'Every feature we build starts with one question: does this help the traveler?',
    },
  ];
}
