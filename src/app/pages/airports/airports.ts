import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { AirportService } from '../../../core/services/app-service/airport-service';
import { AirportService } from '../../core/services/app-service/airport-service';
import { AirportList } from '../../model/skyline-model';

@Component({
  selector: 'app-airports',
  imports: [CommonModule, FormsModule],
  templateUrl: './airports.html',
  styleUrl: './airports.css',
})
export class Airports implements OnInit {
  private airportService = inject(AirportService);

  airportList: AirportList[] = [];
  searchQuery = '';
  pageBreak = 6;
  startPage = 1;

  ngOnInit(): void {
    this.getAirports();
  }

  getAirports() {
    this.airportService.getAllAirports().subscribe({
      next: (res) => {
        this.airportList = res.data;
      },
    });
  }

  get filteredAirports(): AirportList[] {
    if (!this.searchQuery.trim()) return this.airportList;
    const q = this.searchQuery.toLowerCase();
    return this.airportList.filter(
      (a) =>
        a.airportName.toLowerCase().includes(q) ||
        a.airportCode.toLowerCase().includes(q) ||
        a.cityName.toLowerCase().includes(q),
    );
  }

  get airports(): AirportList[] {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.filteredAirports.slice(begin, begin + this.pageBreak);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAirports.length / this.pageBreak);
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
}
