# 🏨 Aurora Hotel — Plataforma de Reservas (Full-Stack)

Aplicación web completa para reservar habitaciones de hotel: búsqueda por fechas y huéspedes, disponibilidad en tiempo real, reserva, autenticación de usuarios y gestión. Proyecto de portafolio construido **por fases**.

**Autor:** Carlos Daniel Crismatt Polo

---

## 🧱 Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Angular 18 (standalone, signals, lazy routes), TypeScript, CSS |
| Backend | Node.js + Express + TypeScript |
| Base de datos | Prisma ORM + SQLite (dev) → PostgreSQL (prod) |
| Auth | JWT + bcrypt |

---

## 📂 Estructura

```
aurora-hotel-booking/
├── frontend/      # App Angular (UI)
├── backend/       # API REST (Express + Prisma)
├── ROADMAP.md     # Plan completo por fases
└── README.md
```

---

## 🚀 Cómo ejecutarlo en local

Necesitas **Node.js 18+**. Abre dos terminales.

### 1) Backend (API)
```bash
cd backend
npm install
npx prisma migrate dev --name init   # crea la base SQLite + datos de ejemplo
npm run dev                           # API en http://localhost:3000
```

### 2) Frontend (Angular)
```bash
cd frontend
npm install
npm start                             # app en http://localhost:4200
```

Abre **http://localhost:4200** en el navegador.

### 👤 Usuarios de prueba (seed)
| Rol | Email | Contraseña |
|-----|-------|------------|
| Usuario | carlos@aurora.com | user123 |
| Admin | admin@aurora.com | admin123 |

---

## 🔌 API (resumen)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado de la API |
| GET | `/api/rooms` | Listar habitaciones |
| GET | `/api/rooms/:id` | Detalle de habitación |
| GET | `/api/rooms/availability?checkIn&checkOut&guests` | Disponibilidad por fechas |
| POST | `/api/auth/register` · `/api/auth/login` | Registro / inicio de sesión (JWT) |
| GET | `/api/bookings/me` | Mis reservas |
| POST | `/api/bookings` | Crear reserva |
| DELETE | `/api/bookings/:id` | Cancelar reserva |
| `/api/admin/*` | — | Gestión de habitaciones y reservas (rol ADMIN) |

---

## ✅ Estado por fases

- [x] **Fase 1** — Entorno, estructura y scaffolding (Angular + Express + Prisma)
- [x] **Fase 2** — Modelo de datos y API REST (habitaciones, disponibilidad, reservas, usuarios)
- [x] **Fase 3** — Frontend: home, listado y detalle de habitaciones
- [x] **Fase 4** — Búsqueda y disponibilidad por fechas
- [x] **Fase 5** — Flujo de reserva
- [x] **Fase 6** — Autenticación (JWT) y "mis reservas"
- [~] **Fase 7** — Panel de administración (API lista; UI de admin pendiente)
- [ ] **Fase 8** — Pagos (Stripe test) y confirmaciones
- [ ] **Fase 9** — Pulido, responsive total e i18n (ES/EN)
- [ ] **Fase 10** — Pruebas automatizadas y despliegue

Consulta **[ROADMAP.md](./ROADMAP.md)** para el detalle de cada fase.
