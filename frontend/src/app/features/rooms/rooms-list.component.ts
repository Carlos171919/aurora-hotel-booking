import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { RoomsService } from '../../core/rooms.service';
import { Room } from '../../core/models';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h2 class="page-title">Habitaciones</h2>

    @if (searching()) {
      <p class="muted">Disponibilidad para {{ range() }} · {{ params['guests'] }} huésped(es)</p>
    }

    @if (loading()) {
      <p class="muted">Cargando habitaciones…</p>
    } @else if (rooms().length === 0) {
      <p class="muted">No hay habitaciones disponibles para esos criterios. Prueba otras fechas.</p>
    } @else {
      <div class="grid">
        @for (room of rooms(); track room.id) {
          <article class="card">
            <img [src]="room.images[0]" [alt]="room.name" />
            <div class="card-body">
              <span class="badge">{{ room.type }}</span>
              <h3>{{ room.name }}</h3>
              <p class="muted">{{ room.description }}</p>
              <div class="card-foot">
                <strong>{{ room.pricePerNight | currency:'USD':'symbol':'1.0-0' }}<span class="muted"> /noche</span></strong>
                <a class="btn btn-primary" [routerLink]="['/habitaciones', room.id]" [queryParams]="params">Ver</a>
              </div>
            </div>
          </article>
        }
      </div>
    }
  `,
})
export class RoomsListComponent {
  private roomsSvc = inject(RoomsService);
  private route = inject(ActivatedRoute);

  rooms = signal<Room[]>([]);
  loading = signal(true);
  searching = signal(false);
  params: Record<string, string> = {};

  constructor() {
    this.route.queryParams.subscribe((p) => {
      this.params = { ...p };
      this.loading.set(true);
      if (p['checkIn'] && p['checkOut']) {
        this.searching.set(true);
        this.roomsSvc.available(p['checkIn'], p['checkOut'], Number(p['guests'] ?? 1)).subscribe({
          next: (r) => { this.rooms.set(r); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
      } else {
        this.searching.set(false);
        this.roomsSvc.list().subscribe({
          next: (r) => { this.rooms.set(r); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
      }
    });
  }

  range() {
    return `${this.params['checkIn']} → ${this.params['checkOut']}`;
  }
}
