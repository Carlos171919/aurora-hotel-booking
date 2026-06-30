# Aurora Hotel — Plataforma de Reservas (Full-Stack)

**Autor:** Carlos Daniel Crismatt Polo
**Stack:** Angular (frontend) · Node.js + Express + TypeScript (backend) · Prisma + SQLite/PostgreSQL (base de datos)
**Tipo:** Proyecto de portafolio full-stack, dividido en 10 fases incrementales.

---

## 1. Visión del proyecto

Aurora Hotel es una aplicación web completa para reservar habitaciones de hotel. El visitante puede buscar por fechas y número de huéspedes, ver habitaciones disponibles con fotos y precios, reservar, pagar (modo prueba) y consultar sus reservas. Un administrador gestiona habitaciones y reservas desde un panel privado.

El proyecto está pensado para construirse **por fases**: cada fase entrega algo funcional y se sube a GitHub, de modo que el portafolio crezca de forma visible y ordenada.

---

## 2. Objetivos

- Demostrar dominio de Angular moderno (componentes standalone, routing, formularios reactivos, servicios, guards, interceptores).
- Construir una API REST real con Node/Express/TypeScript y una base de datos con Prisma.
- Implementar un flujo de negocio completo: búsqueda → disponibilidad → reserva → pago → confirmación.
- Aplicar buenas prácticas: tipado estricto, validaciones, manejo de errores, autenticación JWT y diseño responsive.

---

## 3. Stack tecnológico

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Frontend | Angular 18+ (standalone), TypeScript, RxJS | Framework solicitado; SPA robusta y tipada |
| Estilos | Tailwind CSS (+ Angular Material opcional) | Rápido, responsive, look moderno |
| Backend | Node.js + Express + TypeScript | API REST sencilla y muy demandada |
| ORM/DB | Prisma + SQLite (desarrollo) → PostgreSQL (producción) | SQLite no requiere instalar nada; Prisma permite migrar a Postgres sin reescribir |
| Auth | JWT + bcrypt | Estándar de la industria |
| Pagos | Stripe (modo test) | Pago realista sin dinero real |
| Pruebas | Jasmine/Karma (Angular), Jest/Supertest (API), Cypress (e2e) | Cobertura front y back |
| Despliegue | Frontend: Vercel/Netlify · Backend: Render · DB: Neon/Render Postgres | Gratuito para portafolio |

---

## 4. Arquitectura y estructura de carpetas

```
aurora-hotel-booking/
├── frontend/                 # App Angular
│   └── src/app/
│       ├── core/             # servicios, guards, interceptores, modelos
│       ├── shared/           # componentes y utilidades reutilizables
│       └── features/         # home, rooms, booking, auth, account, admin
├── backend/                  # API Express + TypeScript
│   ├── prisma/               # schema.prisma, migraciones, seed
│   └── src/
│       ├── routes/           # endpoints REST
│       ├── controllers/      # lógica de cada recurso
│       ├── middleware/       # auth, validación, errores
│       └── lib/              # prisma client, utilidades
├── ROADMAP.md                # este documento
└── README.md
```

El frontend habla con el backend por HTTP (REST/JSON). El backend valida, consulta la base vía Prisma y responde. La autenticación viaja como token JWT en el header `Authorization`.

---

## 5. Modelo de datos (entidades principales)

- **User** — id, nombre, email, passwordHash, rol (`USER` | `ADMIN`), fechas.
- **Room** — id, nombre, tipo (individual/doble/suite), descripción, precioPorNoche, capacidad, imágenes, servicios.
- **Booking** — id, userId, roomId, checkIn, checkOut, huéspedes, total, estado (`PENDING` | `CONFIRMED` | `CANCELLED`), referencia de pago.
- **Payment** (fase 8) — id, bookingId, monto, estado, proveedor (Stripe), referencia.

La **disponibilidad** se calcula cruzando las fechas solicitadas contra las reservas existentes de cada habitación (no hay solapamiento de rangos).

---

## 6. Endpoints REST (resumen)

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/rooms` | Listar habitaciones (con filtros) | Público |
| GET | `/api/rooms/:id` | Detalle de una habitación | Público |
| GET | `/api/rooms/availability?checkIn&checkOut&guests` | Habitaciones disponibles en un rango | Público |
| POST | `/api/auth/register` | Crear cuenta | Público |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) | Público |
| GET | `/api/bookings/me` | Mis reservas | Usuario |
| POST | `/api/bookings` | Crear reserva | Usuario |
| DELETE | `/api/bookings/:id` | Cancelar reserva | Usuario/Admin |
| POST | `/api/payments/checkout` | Iniciar pago (Stripe test) | Usuario |
| GET/POST/PUT/DELETE | `/api/admin/rooms` | Gestionar habitaciones | Admin |
| GET | `/api/admin/bookings` | Ver todas las reservas | Admin |

---

## 7. Las 10 fases

### Fase 1 — Cimientos: entorno, estructura y scaffolding
**Objetivo:** dejar corriendo frontend y backend "vacíos" pero conectados.
- Verificar Node, instalar Angular CLI.
- Crear el monorepo (`frontend/`, `backend/`), git y repo público en GitHub.
- `ng new` con routing + Tailwind; servidor Express + TypeScript + Prisma (SQLite).
- Endpoint `/api/health` y que Angular lo consuma.
**Listo cuando:** `npm start` levanta Angular y la API responde "ok".

### Fase 2 — Modelo de datos y API REST
**Objetivo:** datos reales detrás de la API.
- `schema.prisma` con User, Room, Booking; primera migración.
- Script de **seed** con habitaciones de ejemplo e imágenes.
- Endpoints de rooms (listar, detalle, disponibilidad).
**Listo cuando:** `GET /api/rooms` devuelve datos sembrados desde la base.

### Fase 3 — Frontend: home, listado y detalle
**Objetivo:** que se vea como un hotel.
- Layout (header, footer), página de inicio con hero y destacados.
- Listado de habitaciones (cards) y vista de detalle, consumiendo la API.
**Listo cuando:** se navega de home → listado → detalle con datos reales.

### Fase 4 — Búsqueda y disponibilidad
**Objetivo:** buscar por fechas y huéspedes.
- Barra de búsqueda con date pickers y selector de huéspedes.
- Filtro de habitaciones disponibles según el rango.
**Listo cuando:** elegir fechas filtra correctamente lo disponible.

### Fase 5 — Flujo de reserva
**Objetivo:** convertir una búsqueda en una reserva.
- Selección de habitación → formulario reactivo de reserva → resumen con total calculado.
- `POST /api/bookings` crea la reserva (estado PENDING).
**Listo cuando:** se completa una reserva y queda guardada en la base.

### Fase 6 — Autenticación (JWT) y "mis reservas"
**Objetivo:** cuentas de usuario.
- Registro/login con JWT, hashing con bcrypt.
- Guard de rutas e interceptor que adjunta el token.
- Página "Mis reservas".
**Listo cuando:** un usuario inicia sesión y ve solo sus reservas.

### Fase 7 — Panel de administración
**Objetivo:** gestión interna.
- CRUD de habitaciones (crear/editar/eliminar con imágenes).
- Tabla de todas las reservas con cambio de estado.
- Acceso restringido a rol ADMIN.
**Listo cuando:** un admin administra habitaciones y reservas.

### Fase 8 — Pagos (modo prueba) y confirmaciones
**Objetivo:** cerrar el ciclo de compra.
- Checkout con Stripe en modo test; al pagar, la reserva pasa a CONFIRMED.
- Pantalla de confirmación (y email simulado).
**Listo cuando:** un pago de prueba confirma la reserva.

### Fase 9 — Pulido, responsive, validaciones e i18n
**Objetivo:** calidad de producto.
- Diseño responsive (móvil/tablet/desktop), estados de carga y error.
- Validaciones completas en formularios y backend.
- Traducción Español/Inglés.
**Listo cuando:** se ve y funciona bien en cualquier pantalla.

### Fase 10 — Pruebas y despliegue
**Objetivo:** publicarlo.
- Pruebas unitarias (front/back) y e2e del flujo de reserva.
- Despliegue: frontend (Vercel), backend (Render), base de datos (Postgres en la nube).
- README con capturas y enlace en vivo para el portafolio.
**Listo cuando:** hay una URL pública funcionando enlazada en tu CV.

---

## 8. Estimación orientativa

| Fase | Esfuerzo aprox. |
|------|-----------------|
| 1 | 0.5 día |
| 2 | 1 día |
| 3 | 1–2 días |
| 4 | 1 día |
| 5 | 1–2 días |
| 6 | 1–2 días |
| 7 | 2 días |
| 8 | 1–2 días |
| 9 | 1–2 días |
| 10 | 1–2 días |

> Son estimaciones de aprendizaje; iremos fase por fase y subiendo cada avance a GitHub.

---

## 9. Cómo trabajaremos

1. Cada fase se construye, se prueba localmente y se hace commit/push.
2. Al final de cada fase tendrás algo demostrable para tu portafolio.
3. Empezamos por la **Fase 1** (cimientos) y avanzamos con tu visto bueno.
