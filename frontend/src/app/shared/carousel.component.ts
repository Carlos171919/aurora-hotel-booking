import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { IconComponent } from './icon.component';

export interface Slide {
  src: string;
  title: string;
  subtitle: string;
}

const DEFAULT_SLIDES: Slide[] = [
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80', title: 'Suites de ensueño', subtitle: 'Amplios espacios pensados para tu descanso' },
  { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80', title: 'Piscina infinita', subtitle: 'Relájate con las mejores vistas de la ciudad' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80', title: 'Gastronomía de autor', subtitle: 'Sabores locales e internacionales' },
  { src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1600&q=80', title: 'Spa & bienestar', subtitle: 'Un oasis de calma para renovar energías' },
  { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80', title: 'Recepción 24/7', subtitle: 'Atención cálida en todo momento' },
];

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="carousel" (mouseenter)="pause()" (mouseleave)="resume()">
      @for (s of slides; track s.src; let i = $index) {
        <div class="slide" [class.active]="i === current()" [style.backgroundImage]="'url(' + s.src + ')'">
          <div class="slide-cap">
            <h3>{{ s.title }}</h3>
            <p>{{ s.subtitle }}</p>
          </div>
        </div>
      }
      <button class="car-btn prev" (click)="prev()" aria-label="Anterior"><app-icon name="arrowLeft" [size]="20" /></button>
      <button class="car-btn next" (click)="next()" aria-label="Siguiente"><app-icon name="arrowLeft" [size]="20" /></button>
      <div class="dots">
        @for (s of slides; track s.src; let i = $index) {
          <button class="dot" [class.on]="i === current()" (click)="go(i)" aria-label="Ir a la imagen"></button>
        }
      </div>
    </div>
  `,
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[] = DEFAULT_SLIDES;
  current = signal(0);
  private timer: any;

  ngOnInit() {
    if (!this.slides?.length) this.slides = DEFAULT_SLIDES;
    this.start();
  }
  ngOnDestroy() { clearInterval(this.timer); }

  private start() { this.timer = setInterval(() => this.next(), 4500); }
  pause() { clearInterval(this.timer); }
  resume() { this.start(); }
  next() { this.current.set((this.current() + 1) % this.slides.length); }
  prev() { this.current.set((this.current() - 1 + this.slides.length) % this.slides.length); }
  go(i: number) { this.current.set(i); }
}
