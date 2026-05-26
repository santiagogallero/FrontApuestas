# 🧪 Guía de Pruebas - Auction Pulse Pro

## Opción 1: Prueba Rápida con Mock Server (Recomendada)

No necesitás levantar el backend real. El mock server simula todos los endpoints.

### Paso 1: Levantar el mock server

```bash
cd "C:\Users\Santiago\FrontApuestas"
npm run mock
```

Verificá que esté corriendo:
```bash
curl http://localhost:8080/api/health
# {"status":"UP"}
```

### Paso 2: Levantar el frontend

En otra terminal:
```bash
cd "C:\Users\Santiago\FrontApuestas"
npx expo start
```

### Paso 3: Probar en navegador (modo web)

Presioná `w` en la terminal de Expo para abrir en navegador.

> **Nota:** Para probar en emulador Android, cambiá `API_BASE` en `src/api/client.ts` a `http://10.0.2.2:8080`.

---

## ✅ Checklist de Pruebas

### 1. Splash + Login
- [ ] Aparece el splash con el logo ⚡
- [ ] Ingresá con `postor@auction.com` / `Postor123!`
- [ ] Aparece el email del usuario en la pantalla de Cuenta
- [ ] Probar "Continuar sin loguearte" (debería ir a subastas sin token)

### 2. Registro en 2 etapas
- [ ] Ir a Registro, completar datos personales (incluye documento, domicilio, país)
- [ ] Enviar → va a Registro 2/2 (VerifyEmailScreen)
- [ ] Completar número de trámite y URLs de documentos
- [ ] Finalizar → va a "Cuenta en verificación"

### 3. Subastas (integración real con backend)
- [ ] Listado de subastas con datos reales del mock:
  - Subasta #1 - Oro - ACTIVA
  - Subasta #2 - Plata - PENDIENTE
  - Subasta #3 - Común - ACTIVA
  - Subasta #4 - Platino - PENDIENTE
  - Subasta #5 - Oro - CERRADA
- [ ] Filtrar por categoría: Todas, Común, Plata, Oro, Platino
- [ ] Tocar una subasta → va a Detalle

### 4. Detalle de Subasta + Pujas
- [ ] Indicador LIVE / CONECTANDO / CONECTADO
- [ ] Botón "Apuesta rápida +1%" con monto calculado
- [ ] Input de monto manual + botón OFERTAR
- [ ] Después de pujar, se actualiza "Oferta actual" y min/max
- [ ] Alerta de confirmación de puja

### 5. Ventas (Historial de pagos)
- [ ] Estadísticas: total registros y monto total
- [ ] Filtros: Todos, PENDIENTE, PAGADO, VENCIDO
- [ ] Registro #103 muestra multa de $32.000 y cuenta bloqueada

### 6. Mis Productos
- [ ] Listado con datos reales: Patek, moneda, Corolla, Apple Watch, juego de té
- [ ] Filtros: Todos, Disponibles, No disponibles
- [ ] Contadores: total, vendidos, disponibles

### 7. Cuenta + Logout
- [ ] Muestra email real del usuario logueado
- [ ] Muestra roles (POSTOR)
- [ ] Menú: Métodos de pago, Historial, Mis productos, Seguros, Ajustes
- [ ] Logout limpia el token y vuelve a Login

### 8. Billetera
- [ ] Muestra métodos de pago (mock, hasta que backend implemente GET)
- [ ] Saldo disponible

---

## Opción 2: Backend Real (Spring Boot)

### Requisitos
- Java 21+ (el proyecto usa Spring Boot 3.3.5)
- Maven 3.9+ (o usar Docker)
- Docker Desktop (para levantar MySQL + Mailpit)

### Paso 1: Levantar infraestructura

```bash
cd "C:\Users\Santiago\SubastaTrabajoPractico-1"
docker compose up -d
```

Esto levanta:
- MySQL en puerto 3306
- Mailpit (SMTP mock) en puerto 1025 / UI en 8025
- Backend en puerto 8080

### Paso 2: Datos de prueba

El migration `V8__seed_test_data.sql` ya inserta automáticamente:

| Usuario | Password | Rol |
|---------|----------|-----|
| `postor@auction.com` | `Postor123!` | POSTOR |
| `admin@auction.com` | `Admin123!` | ADMIN |

### Paso 3: Cambiar URL del frontend

En `src/api/client.ts`:
```typescript
export const API_BASE = 'http://localhost:8080'; // PC
// export const API_BASE = 'http://10.0.2.2:8080'; // Emulador Android
```

---

## 🔧 Troubleshooting

### TypeScript errors
```bash
npx tsc --noEmit
```

### Mock server no responde
```bash
# Verificar que nada esté usando el puerto 8080
netstat -ano | findstr :8080
# Matar el proceso si es necesario
taskkill /PID <PID> /F
```

### Expo no abre
```bash
npx expo start --clear
```

---

## 📊 Principios SOLID/GRASP aplicados

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/api/client.ts` | HTTP client base (SRP) |
| `src/hooks/useSubastas.ts` | Lógica de fetch + filtros (Information Expert) |
| `src/screens/SubastasScreen.tsx` | Solo renderizado (SRP) |
| `src/components/AppButton.tsx` | Botón reusable (OCP: extensible por props) |
| `src/context/AuthContext.tsx` | Estado global de auth (Creator + High Cohesion) |
| `src/navigation/Navigator.tsx` | Router central (Controller) |
