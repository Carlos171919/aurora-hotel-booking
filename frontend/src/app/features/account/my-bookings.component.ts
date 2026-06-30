import { Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingsService } from '../../core/bookings.service';
import { Booking } from '../../core/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  template: `
    <h2 class="page-title">Mis reservas</h2>

    @if (loading()) {
      <p class="muted">Cargando…</p>
    } @else if (bookings().length === 0) {
      <p class="muted">Aún no tienes reservas. <a routerLink="/habitaciones">Explora habitaciones</a>.</p>
    } @else {
      <div class="list">
        @for (b of bookings(); track b.id) {
          <div class="row">
            <div>
              <strong>{{ b.room?.name }}</strong>
              <div class="muted">
                {{ b.checkIn | date:'mediumDate' }} → {{ b.checkOut | date:'mediumDate' }}
                · {{ b.guests }} huésped(es)
              </div>
            </div>
            <div style="text-align:right">
              <span class="status {{ b.status }}">{{ b.status }}</span>
              <div><strong>{{ b.total | currency:'USD':'symbol':'1.0-0' }}</strong></div>
              @if (b.status !== 'CANCELLED') {
                <button class="btn btn-danger" style="margin-top:.4rem" (click)="cancel(b.id)">Cancelar</button>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class MyBookingsComponent {
  private svc = inject(BookingsService);
  bookings = signal<Booking[]>([]);
  loading = signal(true);

  constructor() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.mine().subscribe({
      next: (b) => { this.bookings.set(b); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  cancel(id: number) {
    this.svc.cancel(id).subscribe({ next: () => this.load() });
  }
}
