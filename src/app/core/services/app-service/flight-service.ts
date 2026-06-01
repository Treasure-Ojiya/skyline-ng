import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FlightList, APIResponseModel } from '../../../model/skyline-model';

const STORAGE_KEY = 'skyline_flights';

const SEED_FLIGHTS: FlightList[] = [
  {
    flightId: 1,
    flightNumber: 'SL-101',
    departureAirportName: 'Murtala Muhammed International Airport',
    departureAirportCode: 'LOS',
    arrivalAirportName: 'Nnamdi Azikiwe International Airport',
    arrivalAirportCode: 'ABV',
    departureTime: '08:00',
    arrivalTime: '09:10',
    price: 35000,
    totalSeats: 120,
    travelDate: '2026-06-15',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 2,
    flightNumber: 'SL-202',
    departureAirportName: 'Nnamdi Azikiwe International Airport',
    departureAirportCode: 'ABV',
    arrivalAirportName: 'Mallam Aminu Kano International Airport',
    arrivalAirportCode: 'KAN',
    departureTime: '11:30',
    arrivalTime: '12:45',
    price: 28000,
    totalSeats: 100,
    travelDate: '2026-06-16',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 3,
    flightNumber: 'SL-303',
    departureAirportName: 'Murtala Muhammed International Airport',
    departureAirportCode: 'LOS',
    arrivalAirportName: 'Port Harcourt International Airport',
    arrivalAirportCode: 'PHC',
    departureTime: '14:00',
    arrivalTime: '15:05',
    price: 22000,
    totalSeats: 90,
    travelDate: '2026-06-17',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 4,
    flightNumber: 'SL-404',
    departureAirportName: 'Murtala Muhammed International Airport',
    departureAirportCode: 'LOS',
    arrivalAirportName: 'Heathrow Airport',
    arrivalAirportCode: 'LHR',
    departureTime: '22:00',
    arrivalTime: '06:30',
    price: 450000,
    totalSeats: 250,
    travelDate: '2026-06-20',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 5,
    flightNumber: 'SL-505',
    departureAirportName: 'Murtala Muhammed International Airport',
    departureAirportCode: 'LOS',
    arrivalAirportName: 'Dubai International Airport',
    arrivalAirportCode: 'DXB',
    departureTime: '01:00',
    arrivalTime: '10:30',
    price: 380000,
    totalSeats: 300,
    travelDate: '2026-06-22',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 6,
    flightNumber: 'SL-606',
    departureAirportName: 'Nnamdi Azikiwe International Airport',
    departureAirportCode: 'ABV',
    arrivalAirportName: 'Charles de Gaulle Airport',
    arrivalAirportCode: 'CDG',
    departureTime: '23:30',
    arrivalTime: '07:00',
    price: 520000,
    totalSeats: 220,
    travelDate: '2026-06-25',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 7,
    flightNumber: 'SL-707',
    departureAirportName: 'Akanu Ibiam International Airport',
    departureAirportCode: 'ENU',
    arrivalAirportName: 'Murtala Muhammed International Airport',
    arrivalAirportCode: 'LOS',
    departureTime: '07:00',
    arrivalTime: '08:10',
    price: 18000,
    totalSeats: 80,
    travelDate: '2026-06-18',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
  {
    flightId: 8,
    flightNumber: 'SL-808',
    departureAirportName: 'O.R. Tambo International Airport',
    departureAirportCode: 'JNB',
    arrivalAirportName: 'Murtala Muhammed International Airport',
    arrivalAirportCode: 'LOS',
    departureTime: '10:00',
    arrivalTime: '14:30',
    price: 210000,
    totalSeats: 180,
    travelDate: '2026-06-19',
    vendorName: 'Skyline Air',
    vendorLogoUrl: '',
  },
];

@Injectable({ providedIn: 'root' })
export class FlightService {
  private seed(): void {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FLIGHTS));
    }
  }

  private read(): FlightList[] {
    this.seed();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private write(flights: FlightList[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
  }

  getAllFlights(): Observable<APIResponseModel> {
    const data = this.read();
    return of({ result: true, message: 'Success', data });
  }

  addFlight(flight: Omit<FlightList, 'flightId'>): Observable<APIResponseModel> {
    const flights = this.read();
    const newId = flights.length > 0 ? Math.max(...flights.map((f) => f.flightId)) + 1 : 1;
    const newFlight: FlightList = { ...flight, flightId: newId };
    flights.push(newFlight);
    this.write(flights);
    return of({ result: true, message: 'Flight added successfully', data: newFlight });
  }

  updateFlight(updated: FlightList): Observable<APIResponseModel> {
    const flights = this.read();
    const idx = flights.findIndex((f) => f.flightId === updated.flightId);
    if (idx === -1) return of({ result: false, message: 'Flight not found', data: null });
    flights[idx] = updated;
    this.write(flights);
    return of({ result: true, message: 'Flight updated successfully', data: updated });
  }

  deleteFlight(flightId: number): Observable<APIResponseModel> {
    const flights = this.read().filter((f) => f.flightId !== flightId);
    this.write(flights);
    return of({ result: true, message: 'Flight deleted', data: null });
  }

  getFlightById(flightId: number): FlightList | undefined {
    return this.read().find((f) => f.flightId === flightId);
  }
}
