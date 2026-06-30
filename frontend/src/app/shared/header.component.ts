import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <a routerLink="/" class="brand">🏨 Aurora Hotel</a>
      <nav class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
        <a routerLink="/habitaciones" routerLinkActive="active">Habitaciones</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/mis-reservas" routerLinkActive="active">Mis reservas</a>
          <span class="hello">Hola, {{ firstName() }}</span>
          <button class="btn btn-ghost" (click)="logout()">Salir</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Ingresar</a>
          <a routerLink="/registro" class="btn btn-primary">Registrarse</a>
        }
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  firstName() {
    return this.auth.user()?.name.split(' ')[0] ?? '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
