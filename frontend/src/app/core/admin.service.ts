import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.config';
import { Booking, Room } from './models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  createRoom(data: Record<string, unknown>) {
    return this.http.post<Room>(`${API_URL}/admin/rooms`, data);
  }
  deleteRoom(id: number) {
    return this.http.delete(`${API_URL}/admin/rooms/${id}`);
  }
  bookings() {
    return this.http.get<Booking[]>(`${API_URL}/admin/bookings`);
  }
  setStatus(id: number, status: string) {
    return this.http.patch<Booking>(`${API_URL}/admin/bookings/${id}`, { status });
  }
}
