import { Room } from '@prisma/client';

const toArray = (s: string) =>
  s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];

// Convierte los campos CSV (images, amenities) en arrays para el frontend.
export function serializeRoom(room: Room) {
  return {
    ...room,
    images: toArray(room.images),
    amenities: toArray(room.amenities),
  };
}
