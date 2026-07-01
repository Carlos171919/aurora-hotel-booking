import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.config';
import { Booking } from './models';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);

  create(data: { roomId: number; checkIn: string; checkOut: string; guests: number }) {
    return this.http.post<Booking>(`${API_URL}/bookings`, data);
  }

  mine() {
    return this.http.get<Booking[]>(`${API_URL}/bookings/me`);
  }

  pay(id: number) {
    return this.http.post<Booking>(`${API_URL}/bookings/${id}/pay`, {});
  }

  cancel(id: number) {
    return this.http.delete<Booking>(`${API_URL}/bookings/${id}`);
  }
}
