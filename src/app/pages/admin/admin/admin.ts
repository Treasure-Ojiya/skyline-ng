import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirportService  } from '../../../core/services/app-service/airport-service';
import { FlightService } from '../../../core/services/app-service/flight-service';
import { AirportList, FlightList } from '../../../model/skyline-model';

const ADMIN_PASSWORD = 'skyline2025';

type Tab = 'airports' | 'flights';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  // --- Auth ---
  isAuthenticated = false;
  adminPassword = '';
  authError = '';

  // --- Tabs ---
  activeTab: Tab = 'airports';

  // --- Airports ---
  airports: AirportList[] = [];
  showAirportForm = false;
  editingAirport: AirportList | null = null;
  airportForm: Omit<AirportList, 'airportId'> = this.blankAirport();
  airportSuccess = '';
  airportError = '';

  // --- Flights ---
  flights: FlightList[] = [];
  showFlightForm = false;
  editingFlight: FlightList | null = null;
  flightForm: Omit<FlightList, 'flightId'> = this.blankFlight();
  flightSuccess = '';
  flightError = '';

  constructor(
    private airportService: AirportService,
    private flightService: FlightService,
  ) {}

  ngOnInit() {
    this.isAuthenticated = sessionStorage.getItem('skyline_admin') === 'true';
    if (this.isAuthenticated) this.loadData();
  }

  login() {
    if (this.adminPassword === ADMIN_PASSWORD) {
      this.isAuthenticated = true;
      this.authError = '';
      sessionStorage.setItem('skyline_admin', 'true');
      this.loadData();
    } else {
      this.authError = 'Incorrect password.';
    }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('skyline_admin');
  }

  loadData() {
    this.airportService.getAllAirports().subscribe((r) => (this.airports = r.data));
    this.flightService.getAllFlights().subscribe((r) => (this.flights = r.data));
  }

  // -------- AIRPORTS --------

  blankAirport(): Omit<AirportList, 'airportId'> {
    return { airportCode: '', airportName: '', cityId: 0, cityName: '' };
  }

  openAddAirport() {
    this.editingAirport = null;
    this.airportForm = this.blankAirport();
    this.showAirportForm = true;
    this.airportSuccess = '';
    this.airportError = '';
  }

  openEditAirport(a: AirportList) {
    this.editingAirport = a;
    this.airportForm = {
      airportCode: a.airportCode,
      airportName: a.airportName,
      cityId: a.cityId,
      cityName: a.cityName,
    };
    this.showAirportForm = true;
    this.airportSuccess = '';
    this.airportError = '';
  }

  saveAirport() {
    this.airportError = '';
    if (
      !this.airportForm.airportCode ||
      !this.airportForm.airportName ||
      !this.airportForm.cityName
    ) {
      this.airportError = 'Please fill in all fields.';
      return;
    }
    if (this.editingAirport) {
      this.airportService
        .updateAirport({ ...this.airportForm, airportId: this.editingAirport.airportId })
        .subscribe((r) => {
          this.airportSuccess = r.message;
          this.showAirportForm = false;
          this.loadData();
        });
    } else {
      this.airportService.addAirport(this.airportForm).subscribe((r) => {
        this.airportSuccess = r.message;
        this.showAirportForm = false;
        this.loadData();
      });
    }
  }

  deleteAirport(id: number) {
    if (!confirm('Delete this airport? This cannot be undone.')) return;
    this.airportService.deleteAirport(id).subscribe(() => {
      this.airportSuccess = 'Airport deleted.';
      this.loadData();
    });
  }

  cancelAirportForm() {
    this.showAirportForm = false;
    this.editingAirport = null;
  }

  // -------- FLIGHTS --------

  blankFlight(): Omit<FlightList, 'flightId'> {
    return {
      flightNumber: '',
      departureAirportName: '',
      departureAirportCode: '',
      arrivalAirportName: '',
      arrivalAirportCode: '',
      departureTime: '',
      arrivalTime: '',
      price: 0,
      totalSeats: 0,
      travelDate: '',
      vendorName: 'Skyline Air',
      vendorLogoUrl: '',
    };
  }

  openAddFlight() {
    this.editingFlight = null;
    this.flightForm = this.blankFlight();
    this.showFlightForm = true;
    this.flightSuccess = '';
    this.flightError = '';
  }

  openEditFlight(f: FlightList) {
    this.editingFlight = f;
    const { flightId, ...rest } = f;
    this.flightForm = { ...rest };
    this.showFlightForm = true;
    this.flightSuccess = '';
    this.flightError = '';
  }

  saveFlight() {
    this.flightError = '';
    const {
      flightNumber,
      departureAirportCode,
      arrivalAirportCode,
      travelDate,
      price,
      totalSeats,
    } = this.flightForm;
    if (
      !flightNumber ||
      !departureAirportCode ||
      !arrivalAirportCode ||
      !travelDate ||
      !price ||
      !totalSeats
    ) {
      this.flightError = 'Please fill in all required fields.';
      return;
    }
    if (this.editingFlight) {
      this.flightService
        .updateFlight({ ...this.flightForm, flightId: this.editingFlight.flightId })
        .subscribe((r) => {
          this.flightSuccess = r.message;
          this.showFlightForm = false;
          this.loadData();
        });
    } else {
      this.flightService.addFlight(this.flightForm).subscribe((r) => {
        this.flightSuccess = r.message;
        this.showFlightForm = false;
        this.loadData();
      });
    }
  }

  deleteFlight(id: number) {
    if (!confirm('Delete this flight? This cannot be undone.')) return;
    this.flightService.deleteFlight(id).subscribe(() => {
      this.flightSuccess = 'Flight deleted.';
      this.loadData();
    });
  }

  cancelFlightForm() {
    this.showFlightForm = false;
    this.editingFlight = null;
  }

  // Populate airport name fields from code when user picks from dropdown
  getAirportByCode(code: string): AirportList | undefined {
    return this.airports.find((a) => a.airportCode === code);
  }

  onDepartureCodeChange() {
    const airport = this.getAirportByCode(this.flightForm.departureAirportCode);
    if (airport) this.flightForm.departureAirportName = airport.airportName;
  }

  onArrivalCodeChange() {
    const airport = this.getAirportByCode(this.flightForm.arrivalAirportCode);
    if (airport) this.flightForm.arrivalAirportName = airport.airportName;
  }
}
