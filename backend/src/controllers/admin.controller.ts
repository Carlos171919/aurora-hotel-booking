import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { serializeRoom } from '../lib/serialize';

const toCsv = (v: unknown) => (Array.isArray(v) ? v.join(',') : String(v ?? ''));

export async function createRoom(req: AuthRequest, res: Response) {
  const { name, type, description, pricePerNight, capacity, images, amenities } = req.body;
  const room = await prisma.room.create({
    data: {
      name,
      type,
      description,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      images: toCsv(images),
      amenities: toCsv(amenities),
    },
  });
  res.status(201).json(serializeRoom(room));
}

export async function updateRoom(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { name, type, description, pricePerNight, capacity, images, amenities } = req.body;
  const room = await prisma.room.update({
    where: { id },
    data: {
      name,
      type,
      description,
      pricePerNight: pricePerNight !== undefined ? Number(pricePerNight) : undefined,
      capacity: capacity !== undefined ? Number(capacity) : undefined,
      images: images !== undefined ? toCsv(images) : undefined,
      amenities: amenities !== undefined ? toCsv(amenities) : undefined,
    },
  });
  res.json(serializeRoom(room));
}

export async function deleteRoom(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  await prisma.booking.deleteMany({ where: { roomId: id } });
  await prisma.room.delete({ where: { id } });
  res.json({ message: 'Habitación eliminada' });
}

export async function allBookings(_req: AuthRequest, res: Response) {
  const bookings = await prisma.booking.findMany({
    include: { room: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
}

export async function setBookingStatus(req: AuthRequest, res: Response) {
  const updated = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status },
  });
  res.json(updated);
}
