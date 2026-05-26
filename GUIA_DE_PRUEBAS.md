# 📘 Guía de Pruebas — Auction Pulse Pro

> Versión: 1.0  
> Última actualización: 2026-05-25

---

## 📋 Tabla de contenidos

1. [Requisitos previos](#1-requisitos-previos)
2. [Estrategia de pruebas](#2-estrategia-de-pruebas)
3. [Opción A: Prueba rápida con Mock Server](#3-opción-a-prueba-rápida-con-mock-server)
4. [Opción B: Prueba con backend real](#4-opción-b-prueba-con-backend-real)
5. [Flujo de pruebas paso a paso](#5-flujo-de-pruebas-paso-a-paso)
6. [Datos de prueba](#6-datos-de-prueba)
7. [Checklist de validación](#7-checklist-de-validación)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Requisitos previos

### Para el frontend

| Herramienta | Versión mínima | Verificación |
|-------------|----------------|--------------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Expo CLI | última | `npx expo --version` |

Instalación de dependencias:

```bash
cd FrontApuestas
npm install
npx expo install @react-native-async-storage/async-storage
```

### Para el backend real (Opción B)

| Herramienta | Versión mínima | Verificación |
|-------------|----------------|--------------|
| Java JDK | 21 | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Docker Desktop | última | `docker --version` |

> **Nota sobre Java:** el proyecto usa Spring Boot 3.3.5 con `java.version=21`. Si tenés Java 26 puede haber incompatibilidades. Usá Java 21 LTS para evitar problemas.

---

## 2. Estrategia de pruebas

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTRATEGIA DE PRUEBAS                     │
├─────────────────────────────────────────────────────────────┤
│  Opción A (rápida)          │  Opción B (integración real)  │
│  ─────────────────          │  ──────────────────────────   │
│  Mock Server (Node.js)      │  Spring Boot + MySQL          │
│  └─ Sin dependencias        │  └─ Docker Compose            │
│  └─ Datos pre-cargados      │  └─ Flyway migrations         │
│  └─ Ideal para UI/UX        │  └─ Ideal para integración    │
└─────────────────────────────────────────────────────────────┘
```

**Recomendación:** empezá con la Opción A para validar el frontend. Cuando todo esté verificado, pasá a la Opción B para probar la integración real.

---

## 3. Opción A: Prueba rápida con Mock Server

### 3.1 ¿Qué es el Mock Server?

Es un servidor HTTP ligero escrito en Node.js puro (sin dependencias externas) que simula el comportamiento del backend Spring Boot. Responde los mismos endpoints con datos de prueba realistas.

### 3.2 Levantar el mock server

```bash
cd FrontApuestas
npm run mock
```

Salida esperada:

```
🚀 Mock Auction Backend corriendo en http://localhost:8080

📋 Endpoints disponibles:
  POST /api/auth/login
  GET  /api/auth/me
  POST /api/auth/register/stage1
  POST /api/auth/register/stage2
  GET  /api/subastas
  GET  /api/subastas/:id
  POST /api/auction-runtime/subasta/conectar
  POST /api/auction-runtime/pujas
  GET  /api/productos
  GET  /api/compliance/mis-pagos
  GET  /api/health

👤 Usuarios de prueba:
  postor@auction.com / Postor123!  (rol: POSTOR)
  admin@auction.com  / Admin123!   (rol: ADMIN)
```

### 3.3 Verificar que responde

```bash
curl http://localhost:8080/api/health
# {"status":"UP"}
```

### 3.4 Levantar el frontend

En **otra terminal**:

```bash
cd FrontApuestas
npx expo start
```

Presioná **`w`** para abrir en navegador web.

> **Emulador Android:** si vas a usar emulador, cambiá `API_BASE` en `src/api/client.ts`:
> ```typescript
> export const API_BASE = 'http://10.0.2.2:8080';
> ```

---

## 4. Opción B: Prueba con backend real

### 4.1 Levantar infraestructura con Docker

```bash
cd SubastaTrabajoPractico-1
docker compose up -d
```

Servicios que levanta:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| MySQL | 3306 | Base de datos |
| Mailpit (SMTP) | 1025 | Servidor de mail de prueba |
| Mailpit UI | 8025 | Panel web para ver mails enviados |
| Backend | 8080 | API REST Spring Boot |

### 4.2 Verificar que el backend inició

```bash
curl http://localhost:8080/api/health
# {"status":"UP"}
```

### 4.3 Datos de prueba automáticos

El migration `V8__seed_test_data.sql` se ejecuta automáticamente al iniciar y crea:

- Usuario **postor@auction.com** con rol POSTOR, categoría PLATA, medios de pago verificados
- Usuario **admin@auction.com** con rol ADMIN
- 5 subastas con diferentes categorías y estados
- 4 registros de pagos/compliance con estados variados

### 4.4 Swagger / API Docs

```
http://localhost:8080/swagger-ui.html
```

---

## 5. Flujo de pruebas paso a paso

### 5.1 Splash Screen

```
⚡ Auction Pulse Pro
[spinner]
```

**Validación:**
- Se muestra el logo con el martillo
- Después de 2.5s (o restauración de sesión) navega al Login o Subastas

---

### 5.2 Login

**Credenciales válidas:**
- Email: `postor@auction.com`
- Password: `Postor123!`

**Flujo esperado:**
1. Ingresar credenciales → presionar "Iniciar Sesión"
2. Se llama `POST /api/auth/login`
3. Se llama `GET /api/auth/me`
4. Guarda token en `AsyncStorage`
5. Navega a **Subastas**

**Credenciales inválidas:**
- Cualquier otro email/password
- Debe mostrar alerta: "Credenciales inválidas"

**Acceso anónimo:**
- Botón "Continuar sin loguearte" → navega a Subastas sin token

---

### 5.3 Registro en dos etapas

#### Etapa 1 — Datos personales

Campos a completar:
| Campo | Valor de ejemplo |
|-------|-----------------|
| Nombre | Juan |
| Apellido | Pérez |
| Correo | juan@test.com |
| Contraseña | Test123! |
| Confirmar contraseña | Test123! |
| Documento | 12345678 |
| Domicilio legal | Calle Falsa 123 |
| País de origen | Argentina |

**Validación:**
- Si falta un campo → Alert: "Por favor completa todos los campos"
- Si contraseñas no coinciden → Alert: "Las contraseñas no coinciden"
- Éxito → navega a **Registro 2/2**

#### Etapa 2 — Verificación de documento

Campos a completar:
| Campo | Valor de ejemplo |
|-------|-----------------|
| Número de trámite | 00123456789 |
| Foto documento (frente) | https://example.com/frente.jpg |
| Foto documento (dorso) | https://example.com/dorso.jpg |

**Validación:**
- Éxito → navega a **Cuenta en verificación**

---

### 5.4 Listado de Subastas

**Endpoint:** `GET /api/subastas`

**Datos esperados (mock):**

| ID | Fecha | Hora | Estado | Categoría | Ubicación |
|----|-------|------|--------|-----------|-----------|
| 1 | 2026-06-15 | 10:00 | ACTIVA | Oro | Salón Principal - Buenos Aires |
| 2 | 2026-06-18 | 14:30 | PENDIENTE | Plata | Sede Córdoba |
| 3 | 2026-06-20 | 11:00 | ACTIVA | Común | Online - Streaming |
| 4 | 2026-06-25 | 09:00 | PENDIENTE | Platino | Salón VIP - Mendoza |
| 5 | 2026-06-22 | 16:00 | CERRADA | Oro | Rosario - Centro Cultural |

**Filtros disponibles:**
- Todas
- Común
- Plata
- Oro
- Platino

**Validación:**
- Se muestran las 5 subastas
- Cada una tiene badge de estado (LIVE / PENDIENTE / CERRADA)
- Badge de categoría
- Botón "Ingresar a la subasta" (si está ACTIVA) o "Ver detalles"

---

### 5.5 Detalle de Subasta + Pujas

**Flujo:**
1. Tocar una subasta ACTIVA (ej: Subasta #1)
2. Se llama `POST /api/auction-runtime/subasta/conectar`
3. Indicador cambia de "CONECTANDO..." → "CONECTADO — SUBASTA EN VIVO"

**Panel de puja:**
- **Oferta actual:** muestra el valor actual
- **Apuesta rápida +1%:** botón con el monto mínimo permitido
- **Monto manual:** input + botón OFERTAR

**Reglas de puja (según consigna del TP):**
- Mínimo: oferta actual + 1% del precio base
- Máximo: oferta actual + 20% del precio base
- No aplican límites para categorías Oro y Platino

**Al pujar:**
- Se llama `POST /api/auction-runtime/pujas`
- Body: `{ subastaId, itemId, importe, moneda }`
- Respuesta actualiza: `ofertaActual`, `minimoPermitido`, `maximoPermitido`
- Alerta: "Puja registrada — Tu oferta de $X fue aceptada"

---

### 5.6 Ventas (Historial de ofertas y pagos)

**Endpoint:** `GET /api/compliance/mis-pagos`

**Datos esperados (mock):**

| Registro | Estado | Monto ofertado | Multa | Bloqueado |
|----------|--------|----------------|-------|-----------|
| 101 | PENDIENTE | $150.000 | $0 | No |
| 102 | PAGADO | $85.000 | $0 | No |
| 103 | VENCIDO | $320.000 | $32.000 | **Sí** |
| 104 | PENDIENTE | $45.000 | $0 | No |

**Validación:**
- Estadísticas: total registros = 4, monto total = $600.000
- Filtros: Todos, PENDIENTE, PAGADO, VENCIDO
- Registro 103 muestra badge rojo de multa y texto "⚠️ Cuenta bloqueada"

---

### 5.7 Mis Productos

**Endpoint:** `GET /api/productos`

**Datos esperados (mock):**

| Producto | Disponible |
|----------|------------|
| Reloj Patek Philippe Nautilus | ✅ Sí |
| Moneda de oro 8 escudos 1813 | ✅ Sí |
| Toyota Corolla 2020 | ❌ No |
| Apple Watch Ultra II | ✅ Sí |
| Juego de té de plata 18 piezas | ❌ No |

**Validación:**
- Contadores: 5 productos, 2 vendidos, 3 disponibles
- Filtros: Todos, Disponibles, No disponibles
- Badge de estado correcto por producto

---

### 5.8 Cuenta y Logout

**Pantalla Cuenta:**
- Avatar con iniciales del email (ej: "PO" para postor@auction.com)
- Email real del usuario logueado
- Roles: POSTOR
- Menú: Métodos de pago, Historial, Mis productos, Seguros, Ajustes

**Logout:**
- Llama `clearToken()` → elimina JWT de `AsyncStorage`
- Limpia estado en `AuthContext`
- Navega a Login

---

## 6. Datos de prueba

### Usuarios

| Email | Password | Rol | Categoría | Estado |
|-------|----------|-----|-----------|--------|
| `postor@auction.com` | `Postor123!` | POSTOR | PLATA | ACTIVO |
| `admin@auction.com` | `Admin123!` | ADMIN | — | ACTIVO |

### Subastas

| ID | Categoría | Estado | Moneda |
|----|-----------|--------|--------|
| 1 | Oro | ACTIVA | ARS |
| 2 | Plata | PENDIENTE | USD |
| 3 | Común | ACTIVA | ARS |
| 4 | Platino | PENDIENTE | USD |
| 5 | Oro | CERRADA | ARS |

---

## 7. Checklist de validación

### Funcionalidad core

- [ ] **Splash** → Login (sesión expirada) o Subastas (sesión vigente)
- [ ] **Login** con credenciales válidas → token guardado, navega a Subastas
- [ ] **Login** con credenciales inválidas → alerta de error
- [ ] **Registro 1/2** → validación de campos obligatorios
- [ ] **Registro 2/2** → validación de URLs y trámite
- [ ] **Registro completo** → cuenta en verificación
- [ ] **Subastas** → listado real desde API, filtros funcionan
- [ ] **Detalle subasta** → conexión, puja rápida, puja manual
- [ ] **Puja** → validación min/max, alerta de confirmación
- [ ] **Ventas** → listado de pagos, filtros, multas y bloqueos visibles
- [ ] **Mis productos** → disponibilidad real, contadores correctos
- [ ] **Cuenta** → email y roles del usuario real
- [ ] **Logout** → limpia token, vuelve a login

### Integración frontend-backend

- [ ] Todos los endpoints devuelven 200/201
- [ ] JWT se envía en header `Authorization: Bearer <token>`
- [ ] Manejo de errores 401/403 con mensajes claros
- [ ] Loading states en todas las pantallas con fetch

### Consigna del TP

- [ ] Registro en dos etapas (datos personales + documentación)
- [ ] Categorías de subastas: Común, Especial, Plata, Oro, Platino
- [ ] Regla de puja +1% / +20% (validada por backend, mostrada en frontend)
- [ ] Monomoneda por subasta
- [ ] Medios de pago verificados requeridos para pujar
- [ ] Historial de participación, pagos y multas
- [ ] Bloqueo de cuenta por multa impaga

---

## 8. Troubleshooting

### El mock server no arranca

```bash
# Verificar si el puerto 8080 está ocupado
netstat -ano | findstr :8080

# Matar el proceso que lo usa
taskkill /PID <PID> /F

# O cambiar el puerto del mock server editando mock-server/server.js
```

### TypeScript errors

```bash
cd FrontApuestas
npx tsc --noEmit
```

### Expo no carga

```bash
# Limpiar caché
npx expo start --clear

# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
npx expo install @react-native-async-storage/async-storage
```

### Backend real no compila (Java 26)

```bash
# Verificar versión de Java
java -version

# Si es 26, instalá Java 21 LTS desde:
# https://adoptium.net/temurin/releases/?version=21

# Configurar JAVA_HOME
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21
```

### Docker Desktop no responde

```bash
# Verificar que Docker Desktop esté abierto
docker info

# Si falla, abrir Docker Desktop manualmente desde el menú inicio
```

### El frontend no conecta al backend

```bash
# Verificar que el backend/mock esté corriendo
curl http://localhost:8080/api/health

# Verificar CORS (solo aplica a backend real, mock ya lo tiene)
# Revisar API_BASE en src/api/client.ts
```

---

## 📁 Archivos relacionados

| Archivo | Propósito |
|---------|-----------|
| `FrontApuestas/mock-server/server.js` | Mock server Node.js |
| `FrontApuestas/src/api/client.ts` | Configuración de URL base |
| `SubastaTrabajoPractico-1/docker-compose.yml` | Infraestructura completa |
| `SubastaTrabajoPractico-1/src/main/resources/db/migration/V8__seed_test_data.sql` | Datos de prueba para backend real |

---

## 🏗️ Arquitectura del frontend (post-refactor)

```
src/
├── api/              ← Capa de servicios (HTTP client + endpoints)
│   ├── client.ts
│   ├── auth.ts
│   ├── subastas.ts
│   ├── productos.ts
│   └── compliance.ts
├── types/            ← Interfaces TypeScript
├── theme/            ← Colores, spacing, typography
├── context/          ← AuthContext (estado global)
├── navigation/       ← Router type-safe
├── hooks/            ← Lógica de negocio (Custom Hooks)
│   ├── useAuth.ts
│   ├── useSubastas.ts
│   ├── useDetalleSubasta.ts
│   ├── useProductos.ts
│   └── usePagos.ts
├── components/       ← Componentes reutilizables
│   ├── AppHeader.tsx
│   ├── AppButton.tsx
│   ├── AppInput.tsx
│   ├── BottomNav.tsx
│   └── StatusBadge.tsx
└── screens/          ← 19 pantallas, una por archivo
    ├── LoginScreen.tsx
    ├── SubastasScreen.tsx
    ├── DetalleSubastaScreen.tsx
    └── ...
```

---

**Fin de la guía.** Si encontrás algún error o tenés dudas, revisá el `TESTING.md` complementario o el código fuente modularizado en `src/`.
