import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomsService } from '../../core/rooms.service';
import { BookingsService } from '../../core/bookings.service';
import { AuthService } from '../../core/auth.service';
import { Room } from '../../core/models';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe],
  template: `
    @if (loading()) {
      <p class="muted">Cargando…</p>
    } @else if (!room()) {
      <p class="error">No se encontró la habitación.</p>
    } @else {
      <a routerLink="/habitaciones" class="muted">← Volver a habitaciones</a>
      <div class="detail" style="margin-top:1rem">
        <div>
          <img [src]="room()!.images[0]" [alt]="room()!.name" />
          <span class="badge" style="margin-top:1rem">{{ room()!.type }}</span>
          <h2 style="margin:.4rem 0">{{ room()!.name }}</h2>
          <p class="muted">{{ room()!.description }}</p>
          <h4>Servicios</h4>
          <div class="amenities">
            @for (a of room()!.amenities; track a) { <span class="chip">{{ a }}</span> }
          </div>
          <p><strong>Capacidad:</strong> {{ room()!.capacity }} huésped(es)</p>
        </div>

        <div class="panel">
          @if (confirmed()) {
            <h3 class="success">¡Reserva creada! ✓</h3>
            <p class="muted">Tu reserva quedó registrada como pendiente.</p>
            <a routerLink="/mis-reservas" class="btn btn-primary btn-block">Ver mis reservas</a>
          } @else {
            <h3>Reservar — {{ room()!.pricePerNight | currency:'USD':'symbol':'1.0-0' }}/noche</h3>
            <form class="form" [formGroup]="form" (ngSubmit)="reservar()">
              <label>Entrada<input type="date" formControlName="checkIn" [min]="today" /></label>
              <label>Salida<input type="date" formControlName="checkOut" [min]="form.value.checkIn || today" /></label>
              <label>Huéspedes<input type="number" formControlName="guests" min="1" [max]="room()!.capacity" /></label>

              @if (nights() > 0) {
                <p>{{ nights() }} noche(s) × {{ room()!.pricePerNight | currency:'USD':'symbol':'1.0-0' }}
                  = <strong>{{ total() | currency:'USD':'symbol':'1.0-0' }}</strong></p>
              }
              @if (error()) { <p class="error">{{ error() }}</p> }

              <button class="btn btn-primary btn-block" type="submit">
                {{ auth.isLoggedIn() ? 'Confirmar reserva' : 'Inicia sesión para reservar' }}
              </button>
            </form>
          }
        </div>
      </div>
    }
  `,
})
export class RoomDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomsSvc = inject(RoomsService);
  private bookingsSvc = inject(BookingsService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  room = signal<Room | null>(null);
  loading = signal(true);
  error = signal('');
  confirmed = signal(false);
  today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [2, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const qp = this.route.snapshot.queryParams;
    if (qp['checkIn']) {
      this.form.patchValue({
        checkIn: qp['checkIn'],
        checkOut: qp['checkOut'],
        guests: Number(qp['guests'] ?? 2),
      });
    }
    this.roomsSvc.get(id).subscribe({
      next: (r) => { this.room.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  nights(): number {
    const { checkIn, checkOut } = this.form.value;
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
    return diff > 0 ? Math.ceil(diff) : 0;
  }

  total(): number {
    return this.nights() * (this.room()?.pricePerNight ?? 0);
  }

  reservar() {
    this.error.set('');
    if (this.form.invalid || this.nights() <= 0) {
      this.error.set('Selecciona un rango de fechas válido.');
      return;
    }
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    const { checkIn, checkOut, guests } = this.form.value;
    this.bookingsSvc
      .create({ roomId: this.room()!.id, checkIn: checkIn!, checkOut: checkOut!, guests: guests! })
      .subscribe({
        next: () => this.confirmed.set(true),
        error: (e) => this.error.set(e.error?.message ?? 'No se pudo crear la reserva.'),
      });
  }
}
