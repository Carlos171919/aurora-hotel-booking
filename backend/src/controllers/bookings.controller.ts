import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createBooking(req: AuthRequest, res: Response) {
  const { roomId, checkIn, checkOut, guests } = req.body;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate <= inDate) {
    return res.status(400).json({ message: 'Rango de fechas inválido' });
  }

  const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
  if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
  if (Number(guests) > room.capacity) {
    return res.status(400).json({ message: 'El número de huéspedes excede la capacidad' });
  }

  const overlap = await prisma.booking.findFirst({
    where: {
      roomId: room.id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      checkIn: { lt: outDate },
      checkOut: { gt: inDate },
    },
  });
  if (overlap) {
    return res.status(409).json({ message: 'La habitación no está disponible en esas fechas' });
  }

  const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / 86400000);
  const total = nights * room.pricePerNight;

  const booking = await prisma.booking.create({
    data: {
      userId: req.user!.id,
      roomId: room.id,
      checkIn: inDate,
      checkOut: outDate,
      guests: Number(guests),
      total,
    },
    include: { room: true },
  });
  res.status(201).json(booking);
}

export async function myBookings(req: AuthRequest, res: Response) {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user!.id },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
}

// Pago simulado: confirma la reserva (modo demo, sin cobro real).
export async function payBooking(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
  if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ message: 'No puedes pagar esta reserva' });
  }
  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ message: 'La reserva está cancelada' });
  }
  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CONFIRMED' },
    include: { room: true },
  });
  res.json(updated);
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
  if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ message: 'No puedes cancelar esta reserva' });
  }
  const updated = await prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
  res.json(updated);
}
