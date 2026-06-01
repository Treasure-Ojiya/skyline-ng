import { Component, inject, OnInit } from '@angular/core';
import { FlightService } from '../../core/services/app-service/flight-service';
import { FlightList } from '../../model/skyline-model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight',
  imports: [DatePipe, DecimalPipe, FormsModule],
  templateUrl: './flight.html',
  styleUrl: './flight.css',
})
export class Flight implements OnInit {
  private router = inject(Router);
  private flightService = inject(FlightService);

  flightList: FlightList[] = [];
  searchQuery = '';
  pageBreak = 6;
  startPage = 1;

  ngOnInit(): void {
    this.getFlights();
  }

  getFlights() {
    this.flightService.getAllFlights().subscribe({
      next: (res) => {
        this.flightList = res.data;
      },
    });
  }

  get filteredFlights(): FlightList[] {
    if (!this.searchQuery.trim()) return this.flightList;
    const q = this.searchQuery.toLowerCase();
    return this.flightList.filter(
      (f) =>
        f.departureAirportName.toLowerCase().includes(q) ||
        f.arrivalAirportName.toLowerCase().includes(q) ||
        f.departureAirportCode.toLowerCase().includes(q) ||
        f.arrivalAirportCode.toLowerCase().includes(q) ||
        f.flightNumber.toLowerCase().includes(q),
    );
  }

  get flights(): FlightList[] {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.filteredFlights.slice(begin, begin + this.pageBreak);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFlights.length / this.pageBreak);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.startPage = page;
  }

  onSearch() {
    this.startPage = 1;
  }

  get visiblePages(): number[] {
    const pagesToShow = 5;
    let start = Math.max(1, this.startPage - Math.floor(pagesToShow / 2));
    let end = Math.min(this.totalPages, start + pagesToShow - 1);
    if (end - start < pagesToShow - 1) start = Math.max(1, end - pagesToShow + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  bookFlight(flightId: number): void {
    this.router.navigate(['/application/booking', flightId]);
  }
}
