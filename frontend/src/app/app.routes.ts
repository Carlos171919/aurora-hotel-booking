import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'habitaciones',
    loadComponent: () => import('./features/rooms/rooms-list.component').then((m) => m.RoomsListComponent),
  },
  {
    path: 'habitaciones/:id',
    loadComponent: () => import('./features/rooms/room-detail.component').then((m) => m.RoomDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'mis-reservas',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/my-bookings.component').then((m) => m.MyBookingsComponent),
  },
  { path: '**', redirectTo: '' },
];
