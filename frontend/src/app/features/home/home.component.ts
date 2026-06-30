import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Tu estancia perfecta en <span>Aurora Hotel</span></h1>
        <p>Habitaciones y suites con el mejor confort. Reserva en segundos.</p>
        <form class="search-bar" [formGroup]="form" (ngSubmit)="search()">
          <label>Entrada
            <input type="date" formControlName="checkIn" [min]="today" />
          </label>
          <label>Salida
            <input type="date" formControlName="checkOut" [min]="form.value.checkIn || today" />
          </label>
          <label>Huéspedes
            <input type="number" formControlName="guests" min="1" max="6" />
          </label>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid"
            style="align-self:flex-end">Buscar</button>
        </form>
      </div>
    </section>

    <section class="features">
      <div class="feature"><h3>✨ Confort</h3><p class="muted">Habitaciones equipadas, limpias y listas para ti.</p></div>
      <div class="feature"><h3>📅 Reserva fácil</h3><p class="muted">Elige fechas y reserva al instante, sin complicaciones.</p></div>
      <div class="feature"><h3>🔒 Seguro</h3><p class="muted">Tus datos y reservas siempre protegidos.</p></div>
    </section>
  `,
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [2, [Validators.required, Validators.min(1)]],
  });

  search() {
    const { checkIn, checkOut, guests } = this.form.value;
    this.router.navigate(['/habitaciones'], { queryParams: { checkIn, checkOut, guests } });
  }
}
