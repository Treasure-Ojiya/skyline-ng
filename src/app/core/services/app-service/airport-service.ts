import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AirportList, APIResponseModel } from '../../../model/skyline-model';

const STORAGE_KEY = 'skyline_airports';

const SEED_AIRPORTS: AirportList[] = [
  {
    airportId: 1,
    airportCode: 'LOS',
    airportName: 'Murtala Muhammed International Airport',
    cityId: 1,
    cityName: 'Lagos',
  },
  {
    airportId: 2,
    airportCode: 'ABV',
    airportName: 'Nnamdi Azikiwe International Airport',
    cityId: 2,
    cityName: 'Abuja',
  },
  {
    airportId: 3,
    airportCode: 'KAN',
    airportName: 'Mallam Aminu Kano International Airport',
    cityId: 3,
    cityName: 'Kano',
  },
  {
    airportId: 4,
    airportCode: 'PHC',
    airportName: 'Port Harcourt International Airport',
    cityId: 4,
    cityName: 'Port Harcourt',
  },
  {
    airportId: 5,
    airportCode: 'ENU',
    airportName: 'Akanu Ibiam International Airport',
    cityId: 5,
    cityName: 'Enugu',
  },
  {
    airportId: 6,
    airportCode: 'ILR',
    airportName: 'Ilorin International Airport',
    cityId: 6,
    cityName: 'Ilorin',
  },
  {
    airportId: 7,
    airportCode: 'CBQ',
    airportName: 'Margaret Ekpo International Airport',
    cityId: 7,
    cityName: 'Calabar',
  },
  {
    airportId: 8,
    airportCode: 'BCN',
    airportName: 'Josep Tarradellas Barcelona-El Prat Airport',
    cityId: 8,
    cityName: 'Barcelona',
  },
  {
    airportId: 9,
    airportCode: 'CDG',
    airportName: 'Charles de Gaulle Airport',
    cityId: 9,
    cityName: 'Paris',
  },
  {
    airportId: 10,
    airportCode: 'JFK',
    airportName: 'John F. Kennedy International Airport',
    cityId: 10,
    cityName: 'New York',
  },
  {
    airportId: 11,
    airportCode: 'LHR',
    airportName: 'Heathrow Airport',
    cityId: 11,
    cityName: 'London',
  },
  {
    airportId: 12,
    airportCode: 'DXB',
    airportName: 'Dubai International Airport',
    cityId: 12,
    cityName: 'Dubai',
  },
  {
    airportId: 13,
    airportCode: 'NRT',
    airportName: 'Narita International Airport',
    cityId: 13,
    cityName: 'Tokyo',
  },
  {
    airportId: 14,
    airportCode: 'CAI',
    airportName: 'Cairo International Airport',
    cityId: 14,
    cityName: 'Cairo',
  },
  {
    airportId: 15,
    airportCode: 'JNB',
    airportName: 'O.R. Tambo International Airport',
    cityId: 15,
    cityName: 'Johannesburg',
  },
];

@Injectable({ providedIn: 'root' })
export class AirportService {
  private seed(): void {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AIRPORTS));
    }
  }

  private read(): AirportList[] {
    this.seed();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private write(airports: AirportList[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(airports));
  }

  getAllAirports(): Observable<APIResponseModel> {
    const data = this.read();
    return of({ result: true, message: 'Success', data });
  }

  addAirport(airport: Omit<AirportList, 'airportId'>): Observable<APIResponseModel> {
    const airports = this.read();
    const newId = airports.length > 0 ? Math.max(...airports.map((a) => a.airportId)) + 1 : 1;
    const newAirport: AirportList = { ...airport, airportId: newId };
    airports.push(newAirport);
    this.write(airports);
    return of({ result: true, message: 'Airport added successfully', data: newAirport });
  }

  updateAirport(updated: AirportList): Observable<APIResponseModel> {
    const airports = this.read();
    const idx = airports.findIndex((a) => a.airportId === updated.airportId);
    if (idx === -1) return of({ result: false, message: 'Airport not found', data: null });
    airports[idx] = updated;
    this.write(airports);
    return of({ result: true, message: 'Airport updated successfully', data: updated });
  }

  deleteAirport(airportId: number): Observable<APIResponseModel> {
    const airports = this.read().filter((a) => a.airportId !== airportId);
    this.write(airports);
    return of({ result: true, message: 'Airport deleted', data: null });
  }
}
