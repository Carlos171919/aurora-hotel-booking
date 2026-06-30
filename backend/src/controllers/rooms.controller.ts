import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { serializeRoom } from '../lib/serialize';

export async function listRooms(_req: Request, res: Response) {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: 'asc' } });
  res.json(rooms.map(serializeRoom));
}

export async function getRoom(req: Request, res: Response) {
  const room = await prisma.room.findUnique({ where: { id: Number(req.params.id) } });
  if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
  res.json(serializeRoom(room));
}

// Habitaciones libres en un rango de fechas y con capacidad suficiente.
export async function availableRooms(req: Request, res: Response) {
  const { checkIn, checkOut, guests } = req.query;
  const inDate = new Date(String(checkIn));
  const outDate = new Date(String(checkOut));
  const minGuests = Number(guests ?? 1);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate <= inDate) {
    return res.status(400).json({ message: 'Rango de fechas inválido' });
  }

  const rooms = await prisma.room.findMany({
    where: { capacity: { gte: minGuests } },
    include: {
      bookings: {
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          checkIn: { lt: outDate },
          checkOut: { gt: inDate },
        },
      },
    },
    orderBy: { pricePerNight: 'asc' },
  });

  const available = rooms
    .filter((r) => r.bookings.length === 0)
    .map(({ bookings, ...room }) => serializeRoom(room as any));

  res.json(available);
}
