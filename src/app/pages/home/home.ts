import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slider } from '../../shared/components/slider/slider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Slider, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  backgroundImage = 'assets/imgs/city-aerial-view-1.jpg';
  backgroundSize = 'cover';
  backgroundPosition = 'center';
}
