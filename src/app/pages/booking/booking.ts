import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../../core/services/app-service/flight-service';
import { BookingService } from '../../core/services/app-service/booking-service';
import { AuthService } from '../../core/services/authService/auth-service';
import { FlightList } from '../../model/skyline-model';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private bookingService = inject(BookingService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flightService = inject(FlightService);
  private authService = inject(AuthService);

  bookingForm!: FormGroup;
  flightId!: number;
  userId: number | null = null;
  flightData: FlightList | undefined;
  bookingSuccess = false;
  errorMessage = '';

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      this.router.navigate(['/authentication']);
      return;
    }

    this.flightData = this.flightService.getFlightById(this.flightId);
    this.initializeForm();
  }

  private initializeForm(): void {
    this.bookingForm = this.formBuilder.group({
      flightId: [this.flightId],
      customerId: [this.userId],
      bookingDate: [new Date().toISOString()],
      totalAmount: [0],
      FlightBookingTravelers: this.formBuilder.array([]),
    });
    this.addTraveler();
    this.updateTotalAmount();
  }

  get travelers(): FormArray {
    return this.bookingForm.get('FlightBookingTravelers') as FormArray;
  }

  private createTraveler(): FormGroup {
    return this.formBuilder.group({
      travelerName: ['', [Validators.required, Validators.minLength(2)]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9+\-() ]+$/)]],
      aadharNo: ['', [Validators.required, Validators.minLength(5)]],
      seatNo: [null, [Validators.required, Validators.min(1)]],
    });
  }

  addTraveler(): void {
    this.travelers.push(this.createTraveler());
    this.updateTotalAmount();
  }

  removeTraveler(index: number): void {
    if (this.travelers.length > 1) {
      this.travelers.removeAt(index);
      this.updateTotalAmount();
    }
  }

  updateTotalAmount(): void {
    const total = this.travelers.length * (this.flightData?.price ?? 0);
    this.bookingForm.patchValue({ totalAmount: total }, { emitEvent: false });
  }

  get flightPrice(): number {
    return this.flightData?.price ?? 0;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields before confirming.';
      return;
    }

    const formValue = this.bookingForm.value;
    const payload = {
      flightId: Number(formValue.flightId),
      customerId: Number(formValue.customerId),
      bookingDate: new Date(formValue.bookingDate).toISOString(),
      totalAmount: Number(formValue.totalAmount),
      FlightBookingTravelers: formValue.FlightBookingTravelers.map((t: any) => ({
        travelerName: t.travelerName?.trim(),
        contactNo: t.contactNo?.trim(),
        aadharNo: t.aadharNo?.trim(),
        seatNo: Number(t.seatNo),
      })),
    };

    this.bookingService.bookTicket(payload).subscribe({
      next: (res) => {
        if (res.result) {
          this.bookingSuccess = true;
          this.generateBookingTicket(payload);
        } else {
          this.errorMessage = res.message || 'Booking failed. Please try again.';
        }
      },
    });
  }

  generateBookingTicket(payload: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const { flightId, customerId, bookingDate, totalAmount, FlightBookingTravelers } = payload;
    const flight = this.flightData;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(251, 191, 36);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Skyline ✈  E-Ticket', 15, 18);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Details', 15, 42);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(251, 191, 36);
    doc.rect(12, 46, 88, 80);

    doc.text(`Flight: ${flight?.flightNumber ?? flightId}`, 16, 56);
    doc.text(
      `From: ${flight?.departureAirportCode} – ${flight?.departureAirportName ?? ''}`,
      16,
      64,
    );
    doc.text(`To:   ${flight?.arrivalAirportCode} – ${flight?.arrivalAirportName ?? ''}`, 16, 72);
    doc.text(`Date: ${flight?.travelDate ?? ''}`, 16, 80);
    doc.text(`Departs: ${flight?.departureTime}  Arrives: ${flight?.arrivalTime}`, 16, 88);
    doc.text(`Customer ID: ${customerId}`, 16, 96);
    doc.text(`Booked: ${new Date(bookingDate).toLocaleString()}`, 16, 104);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: NGN ${totalAmount.toLocaleString()}`, 16, 118);

    doc.setFont('helvetica', 'bold');
    doc.text('Traveler(s)', 110, 42);
    doc.setFont('helvetica', 'normal');
    doc.rect(108, 46, 90, 120);
    let y = 56;
    FlightBookingTravelers.forEach((t: any, i: number) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Traveler ${i + 1}`, 112, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${t.travelerName}`, 114, y);
      y += 6;
      doc.text(`Contact: ${t.contactNo}`, 114, y);
      y += 6;
      doc.text(`National ID: ${t.aadharNo}`, 114, y);
      y += 6;
      doc.text(`Seat No: ${t.seatNo}`, 114, y);
      y += 10;
    });

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 272, 210, 25, 'F');
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('Thank you for flying with Skyline. Have a wonderful journey!', 15, 282);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 289);

    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(8, 8, 194, 262, 4, 4);
    doc.save(`Skyline_Ticket_FL${flightId}.pdf`);
  }
}
