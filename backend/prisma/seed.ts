import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const rooms = [
  {
    name: 'Individual Estándar',
    type: 'Individual',
    description: 'Acogedora habitación individual con cama sencilla, ideal para viajeros de negocios.',
    pricePerNight: 45,
    capacity: 1,
    images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Escritorio',
  },
  {
    name: 'Doble Confort',
    type: 'Doble',
    description: 'Habitación doble con cama queen, perfecta para parejas o estancias cortas.',
    pricePerNight: 75,
    capacity: 2,
    images: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Minibar,Caja fuerte',
  },
  {
    name: 'Doble Superior',
    type: 'Doble',
    description: 'Doble superior con vista a la ciudad y zona de estar.',
    pricePerNight: 95,
    capacity: 2,
    images: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Minibar,Balcón',
  },
  {
    name: 'Suite Junior',
    type: 'Suite',
    description: 'Suite junior espaciosa con sala separada y cama king.',
    pricePerNight: 140,
    capacity: 3,
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Minibar,Sala de estar,Bañera',
  },
  {
    name: 'Suite Ejecutiva',
    type: 'Suite',
    description: 'Suite ejecutiva premium con todas las comodidades para estancias largas.',
    pricePerNight: 190,
    capacity: 4,
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Minibar,Sala de estar,Cocina,Vista panorámica',
  },
  {
    name: 'Suite Presidencial',
    type: 'Suite',
    description: 'La experiencia más exclusiva: amplios espacios, lujo y servicio dedicado.',
    pricePerNight: 320,
    capacity: 5,
    images: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
    amenities: 'WiFi,TV,Aire acondicionado,Minibar,Sala de estar,Cocina,Jacuzzi,Servicio 24h',
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@aurora.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });
  await prisma.user.create({
    data: {
      name: 'Carlos Crismatt',
      email: 'carlos@aurora.com',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
    },
  });

  for (const r of rooms) {
    await prisma.room.create({ data: r });
  }

  console.log('Seed completado: 2 usuarios y', rooms.length, 'habitaciones.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
