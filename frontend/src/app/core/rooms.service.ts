import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import { Room } from './models';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private http = inject(HttpClient);

  list(): Observable<Room[]> {
    return this.http.get<Room[]>(`${API_URL}/rooms`);
  }

  get(id: number): Observable<Room> {
    return this.http.get<Room>(`${API_URL}/rooms/${id}`);
  }

  available(checkIn: string, checkOut: string, guests: number): Observable<Room[]> {
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut)
      .set('guests', guests);
    return this.http.get<Room[]>(`${API_URL}/rooms/availability`, { params });
  }
}
