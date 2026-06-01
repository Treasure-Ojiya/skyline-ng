import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../../shared/components/nav/nav';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-application',
  imports: [RouterOutlet, Nav, Footer],
  templateUrl: './application.html',
  styleUrl: './application.css',
})
export class Application {}
