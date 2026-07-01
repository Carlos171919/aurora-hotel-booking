import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { CarouselComponent } from '../../shared/carousel.component';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent, CarouselComponent, RevealDirective],
  template: `
    <section class="hero">
      <div class="hero-content">
        <span class="eyebrow">Bienvenido a Aurora Hotel</span>
        <h1>Descansa mejor. <span>Reserva en segundos.</span></h1>
        <p>Habitaciones y suites cuidadas al detalle, con atención 24/7 y las mejores vistas de la ciudad.</p>

        <form class="search-bar" [formGroup]="form" (ngSubmit)="search()">
          <label>Entrada<input type="date" formControlName="checkIn" [min]="today" /></label>
          <label>Salida<input type="date" formControlName="checkOut" [min]="form.value.checkIn || today" /></label>
          <label>Huéspedes<input type="number" formControlName="guests" min="1" max="6" /></label>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Buscar disponibilidad</button>
        </form>

        <div class="hero-rating">
          <span class="stars">
            <app-icon name="star" [size]="15" /><app-icon name="star" [size]="15" /><app-icon name="star" [size]="15" /><app-icon name="star" [size]="15" /><app-icon name="star" [size]="15" />
          </span>
          4.9/5 · basado en 1.200+ huéspedes
        </div>
      </div>
    </section>

    <section class="section" reveal>
      <div class="section-head">
        <h2>Descubre nuestros espacios</h2>
        <p class="muted">Un recorrido por lo que te espera en Aurora Hotel.</p>
      </div>
      <app-carousel />
    </section>

    <section class="section" reveal>
      <div class="section-head">
        <h2>Todo para una gran estancia</h2>
        <p class="muted">Servicios pensados para que solo te preocupes por disfrutar.</p>
      </div>
      <div class="features">
        <div class="feature"><span class="ficon"><app-icon name="service" [size]="24" /></span><h3>Atención 24/7</h3><p class="muted">Recepción y conserjería a cualquier hora.</p></div>
        <div class="feature"><span class="ficon"><app-icon name="calendar" [size]="24" /></span><h3>Reserva flexible</h3><p class="muted">Elige tus fechas y confirma en segundos.</p></div>
        <div class="feature"><span class="ficon"><app-icon name="shield" [size]="24" /></span><h3>Pago seguro</h3><p class="muted">Tus datos y tu reserva siempre protegidos.</p></div>
        <div class="feature"><span class="ficon"><app-icon name="pin" [size]="24" /></span><h3>Ubicación céntrica</h3><p class="muted">A pasos de los puntos clave de la ciudad.</p></div>
      </div>
    </section>

    <section class="section about" reveal>
      <div class="about-media">
        <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&q=80" alt="Habitación de Aurora Hotel" />
        <div class="about-badge"><strong>15+</strong>años de experiencia</div>
      </div>
      <div>
        <span class="eyebrow" style="color:var(--gold)">Sobre nosotros</span>
        <h2>Una experiencia pensada para ti</h2>
        <p class="muted">En Aurora Hotel combinamos diseño, confort y un servicio cercano para que cada estancia sea memorable.</p>
        <ul>
          <li><app-icon name="check" [size]="18" /> Habitaciones renovadas y equipadas</li>
          <li><app-icon name="check" [size]="18" /> Desayuno buffet incluido</li>
          <li><app-icon name="check" [size]="18" /> Cancelación flexible</li>
          <li><app-icon name="check" [size]="18" /> Wi-Fi de alta velocidad en todo el hotel</li>
        </ul>
      </div>
    </section>

    <section class="section" reveal>
      <div class="section-head"><h2>Nuestras habitaciones</h2><p class="muted">Desde prácticas individuales hasta suites de lujo.</p></div>
      <div class="roomtypes">
        <a class="rt" routerLink="/habitaciones"><span class="rt-ic"><app-icon name="bed" [size]="22" /></span><div><strong>Individuales</strong><p class="muted">Ideales para viajes de trabajo.</p></div></a>
        <a class="rt" routerLink="/habitaciones"><span class="rt-ic"><app-icon name="bed" [size]="22" /></span><div><strong>Dobles</strong><p class="muted">Confort para dos personas.</p></div></a>
        <a class="rt" routerLink="/habitaciones"><span class="rt-ic"><app-icon name="star" [size]="22" /></span><div><strong>Suites</strong><p class="muted">La experiencia más exclusiva.</p></div></a>
      </div>
    </section>

    <section class="stats" reveal>
      <div class="stat"><strong>50+</strong><span class="muted">Habitaciones</span></div>
      <div class="stat"><strong>24/7</strong><span class="muted">Recepción</span></div>
      <div class="stat"><strong>4.9</strong><span class="muted">Valoración media</span></div>
      <div class="stat"><strong>100%</strong><span class="muted">Reserva online</span></div>
    </section>

    <section class="section" reveal>
      <div class="testimonial">
        <span class="stars"><app-icon name="star" [size]="18" /><app-icon name="star" [size]="18" /><app-icon name="star" [size]="18" /><app-icon name="star" [size]="18" /><app-icon name="star" [size]="18" /></span>
        <p>"Una estancia impecable. La reserva fue rapidísima y la habitación superó nuestras expectativas."</p>
        <span class="muted">— María G., huésped verificada</span>
      </div>
    </section>

    <section class="cta" reveal>
      <div>
        <h2>¿Listo para tu próxima escapada?</h2>
        <p class="cta-sub">Encuentra la habitación perfecta hoy mismo.</p>
      </div>
      <a class="btn btn-primary" routerLink="/habitaciones">Ver habitaciones</a>
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
