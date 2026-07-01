import { Component, inject, signal } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingsService } from '../../core/bookings.service';
import { Booking } from '../../core/models';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink, IconComponent],
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
              <div style="display:flex;gap:.4rem;justify-content:flex-end;margin-top:.4rem">
                @if (b.status === 'PENDING') {
                  <button class="btn btn-primary btn-sm" (click)="pay(b.id)"><app-icon name="card" [size]="15" /> Pagar</button>
                }
                @if (b.status !== 'CANCELLED') {
                  <button class="btn btn-danger btn-sm" (click)="cancel(b.id)">Cancelar</button>
                }
              </div>
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

  pay(id: number) { this.svc.pay(id).subscribe({ next: () => this.load() }); }
  cancel(id: number) { this.svc.cancel(id).subscribe({ next: () => this.load() }); }
}
