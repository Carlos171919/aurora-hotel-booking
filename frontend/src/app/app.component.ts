import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="container">
      <router-outlet />
    </main>
    <footer class="footer">
      © {{ year }} Aurora Hotel · Proyecto full-stack de portafolio — Carlos Crismatt
    </footer>
  `,
})
export class AppComponent {
  year = new Date().getFullYear();
}
