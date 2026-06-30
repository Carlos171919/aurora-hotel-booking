import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap panel">
      <h2>Ingresar</h2>
      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <label>Email<input type="email" formControlName="email" /></label>
        <label>Contraseña<input type="password" formControlName="password" /></label>
        @if (error()) { <p class="error">{{ error() }}</p> }
        <button class="btn btn-primary btn-block" type="submit" [disabled]="form.invalid">Entrar</button>
      </form>
      <p class="muted" style="margin-top:1rem">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
      <p class="muted" style="font-size:.78rem">Demo: carlos&#64;aurora.com / user123 · admin&#64;aurora.com / admin123</p>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal('');
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    this.error.set('');
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/'),
      error: (e) => this.error.set(e.error?.message ?? 'Error al iniciar sesión'),
    });
  }
}
