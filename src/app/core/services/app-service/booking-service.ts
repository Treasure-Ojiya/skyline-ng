import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookingRecord, APIResponseModel } from '../../../model/skyline-model';

const STORAGE_KEY = 'skyline_bookings';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private read(): BookingRecord[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private write(bookings: BookingRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  bookTicket(data: Omit<BookingRecord, 'bookingId'>): Observable<APIResponseModel> {
    const bookings = this.read();
    const newId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.bookingId)) + 1 : 1;
    const newBooking: BookingRecord = { ...data, bookingId: newId };
    bookings.push(newBooking);
    this.write(bookings);
    return of({
      result: true,
      message: 'Booking confirmed! Your e-ticket is ready.',
      data: newBooking,
    });
  }

  getBookingsByCustomer(customerId: number): BookingRecord[] {
    return this.read().filter((b) => b.customerId === customerId);
  }

  getAllBookings(): BookingRecord[] {
    return this.read();
  }
}
