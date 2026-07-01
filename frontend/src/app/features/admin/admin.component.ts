import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/admin.service';
import { RoomsService } from '../../core/rooms.service';
import { Room, Booking } from '../../core/models';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, IconComponent],
  template: `
    <h2 class="page-title"><app-icon name="sliders" [size]="22" /> Panel de administración</h2>

    <div class="admin-grid">
      <div class="panel admin-section">
        <h3>Nueva habitación</h3>
        <form class="mini-form" [formGroup]="form" (ngSubmit)="addRoom()">
          <label>Nombre<input formControlName="name" /></label>
          <label>Tipo<input formControlName="type" /></label>
          <label>Precio/noche<input type="number" formControlName="pricePerNight" /></label>
          <label>Capacidad<input type="number" formControlName="capacity" /></label>
          <label class="full">URL de imagen<input formControlName="images" placeholder="https://…" /></label>
          <label class="full">Servicios (separados por coma)<input formControlName="amenities" /></label>
          <label class="full">Descripción<textarea rows="2" formControlName="description"></textarea></label>
          <div class="full">
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Crear habitación</button>
            @if (msg()) { <span class="success" style="margin-left:.6rem">{{ msg() }}</span> }
          </div>
        </form>
      </div>

      <div class="panel admin-section">
        <h3>Habitaciones ({{ rooms().length }})</h3>
        <table class="table">
          <thead><tr><th>Nombre</th><th>Tipo</th><th>Precio</th><th>Cap.</th><th></th></tr></thead>
          <tbody>
            @for (r of rooms(); track r.id) {
              <tr>
                <td>{{ r.name }}</td>
                <td>{{ r.type }}</td>
                <td>{{ r.pricePerNight | currency:'USD':'symbol':'1.0-0' }}</td>
                <td>{{ r.capacity }}</td>
                <td><button class="btn btn-danger btn-sm" (click)="removeRoom(r.id)">Eliminar</button></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="panel admin-section">
        <h3>Reservas ({{ bookings().length }})</h3>
        <table class="table">
          <thead><tr><th>#</th><th>Huésped</th><th>Habitación</th><th>Fechas</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            @for (b of bookings(); track b.id) {
              <tr>
                <td>{{ b.id }}</td>
                <td>{{ b.user?.name }}<br /><span class="muted" style="font-size:.75rem">{{ b.user?.email }}</span></td>
                <td>{{ b.room?.name }}</td>
                <td>{{ b.checkIn | date:'dd/MM/yy' }} → {{ b.checkOut | date:'dd/MM/yy' }}</td>
                <td>{{ b.total | currency:'USD':'symbol':'1.0-0' }}</td>
                <td><span class="status {{ b.status }}">{{ b.status }}</span></td>
                <td>
                  @if (b.status !== 'CONFIRMED') { <button class="btn btn-sm" style="background:#dcfce7;color:#15803d" (click)="setStatus(b.id,'CONFIRMED')">Confirmar</button> }
                  @if (b.status !== 'CANCELLED') { <button class="btn btn-danger btn-sm" (click)="setStatus(b.id,'CANCELLED')">Cancelar</button> }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminComponent {
  private admin = inject(AdminService);
  private roomsSvc = inject(RoomsService);
  private fb = inject(FormBuilder);

  rooms = signal<Room[]>([]);
  bookings = signal<Booking[]>([]);
  msg = signal('');

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['Doble', Validators.required],
    pricePerNight: [80, [Validators.required, Validators.min(1)]],
    capacity: [2, [Validators.required, Validators.min(1)]],
    images: ['', Validators.required],
    amenities: ['WiFi,TV,Aire acondicionado'],
    description: ['', Validators.required],
  });

  constructor() {
    this.loadRooms();
    this.loadBookings();
  }

  loadRooms() { this.roomsSvc.list().subscribe((r) => this.rooms.set(r)); }
  loadBookings() { this.admin.bookings().subscribe((b) => this.bookings.set(b)); }

  addRoom() {
    if (this.form.invalid) return;
    this.admin.createRoom(this.form.value as Record<string, unknown>).subscribe(() => {
      this.msg.set('Habitación creada');
      this.form.reset({ type: 'Doble', pricePerNight: 80, capacity: 2, amenities: 'WiFi,TV,Aire acondicionado' });
      this.loadRooms();
    });
  }

  removeRoom(id: number) { this.admin.deleteRoom(id).subscribe(() => this.loadRooms()); }
  setStatus(id: number, status: string) { this.admin.setStatus(id, status).subscribe(() => this.loadBookings()); }
}
