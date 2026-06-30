import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import roomsRouter from './routes/rooms.routes';
import authRouter from './routes/auth.routes';
import bookingsRouter from './routes/bookings.routes';
import adminRouter from './routes/admin.routes';
import { notFound, errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'aurora-hotel-api', time: new Date().toISOString() });
});

app.use('/api/rooms', roomsRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`Aurora Hotel API corriendo en http://localhost:${PORT}`);
});
