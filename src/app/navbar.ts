// import { Component, inject, HostListener, OnInit } from '@angular/core';
// import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/authService/auth-service';
// import { filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterLink, RouterLinkActive, CommonModule],
//   templateUrl: './navbar.html',
//   styleUrl: './navbar.css',
// })
// export class Navbar implements OnInit {
//   scrolled = false;
//   isHomePage = false;
//   menuOpen = false;
//   isLoggedIn = false;

//   router = inject(Router);
//   private authService = inject(AuthService);

//   ngOnInit() {
//     this.router.events
//       .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
//       .subscribe((event: NavigationEnd) => {
//         this.isHomePage =
//           event.urlAfterRedirects === '/' ||
//           event.urlAfterRedirects === '/home';
//         this.menuOpen = false;
//       });

//     this.authService.isLoggedIn$.subscribe((status) => {
//       this.isLoggedIn = status;
//     });
//   }

//   @HostListener('window:scroll', [])
//   onWindowScroll() {
//     this.scrolled = window.scrollY > 80;
//   }

//   goToAuth() {
//     this.router.navigate(['/authentication']);
//   }

//   logout() {
//     this.authService.logout();
//     this.router.navigate(['/home']);
//   }

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }

//   closeMenu() {
//     this.menuOpen = false;
//   }
// }
