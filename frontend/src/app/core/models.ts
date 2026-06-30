export interface Room {
  id: number;
  name: string;
  type: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  images: string[];
  amenities: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  room?: Room;
}
