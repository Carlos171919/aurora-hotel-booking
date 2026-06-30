import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from './api.config';
import { AuthResponse, User } from './models';

const TOKEN_KEY = 'aurora_token';
const USER_KEY = 'aurora_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  user = signal<User | null>(this.loadUser());
  isLoggedIn = computed(() => this.user() !== null);
  isAdmin = computed(() => this.user()?.role === 'ADMIN');

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.user.set(res.user);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap((r) => this.persist(r)));
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(tap((r) => this.persist(r)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
  }
}
