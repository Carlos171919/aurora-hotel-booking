import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap panel">
      <h2>Crear cuenta</h2>
      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <label>Nombre<input type="text" formControlName="name" /></label>
        <label>Email<input type="email" formControlName="email" /></label>
        <label>Contraseña (mín. 6)<input type="password" formControlName="password" /></label>
        @if (error()) { <p class="error">{{ error() }}</p> }
        <button class="btn btn-primary btn-block" type="submit" [disabled]="form.invalid">Registrarme</button>
      </form>
      <p class="muted" style="margin-top:1rem">¿Ya tienes cuenta? <a routerLink="/login">Ingresa</a></p>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error.set('');
    const { name, email, password } = this.form.value;
    this.auth.register(name!, email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => this.error.set(e.error?.message ?? 'No se pudo crear la cuenta'),
    });
  }
}
