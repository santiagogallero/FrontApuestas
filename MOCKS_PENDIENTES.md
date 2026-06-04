# Mocks pendientes de conectar al backend

Este archivo documenta los datos hardcodeados (mocks) del frontend que **no pudieron conectarse** al backend porque falta el endpoint correspondiente o el seed es demasiado complejo.

---

## Billetera (`BilleteraScreen.tsx`)

| Dato | Línea | Estado | Motivo |
|------|-------|--------|--------|
| Tarjeta Visa terminada en 4242 | 25 | Mock hardcodeado | Falta `GET /api/auth/payment-methods` |
| Cuenta Chase terminada en 7856 | 38 | Mock hardcodeado | Falta `GET /api/auth/payment-methods` |
| Saldo disponible `$12,480.00` | 51 | Mock hardcodeado | No existe endpoint de saldo |

> El `POST /api/auth/payment-methods` sí existe y ya fue conectado en las pantallas de alta
> (AgregarTarjeta, AgregarCuentaBancaria, VerificarCheque). El problema es la lectura de vuelta.

---

## Cuenta (`CuentaScreen.tsx`)

| Dato | Línea | Estado | Motivo |
|------|-------|--------|--------|
| Badge `3 Verificado` | 29 | Mock hardcodeado | Falta endpoint de count de medios verificados |
| Nivel `74%` / Siguiente: PLATINO | 64-65 | Mock hardcodeado | Falta endpoint de progreso de nivel |
| Stats `42` subastas | 75 | Mock hardcodeado | Falta endpoint de estadísticas de usuario |
| Stats `12` ganado | 79 | Mock hardcodeado | Ídem |
| Stats `$142k` pagado | 83 | Mock hardcodeado | Ídem |
| Categoría mostrada | 40 | Parcial | Muestra `roles.join()` = "POSTOR" en vez de la categoría real "PLATA" de `registro_postor`. `GET /api/auth/me` no devuelve la categoría. |

---

## FinalizarCompra / PagoExitoso / PagoFallido / DetalleAdjudicacion

| Pantalla | Dato mock | Motivo |
|----------|-----------|--------|
| FinalizarCompra | Métodos de pago hardcodeados | Falta `GET /api/auth/payment-methods` |
| FinalizarCompra | Penalización `$150` fija | Falta endpoint de penalización aplicable |
| PagoExitoso / PagoFallido | TXN ID, serial, montos fijos | El `GET /api/compliance/mis-pagos` (`apiGetMisPagos` + hook `usePagos`) ya existe pero no se wired a estas pantallas |
| DetalleAdjudicacion | `$1,880`, `$30,000`, datos fijos | Falta endpoint de detalle de adjudicación |

> `usePagos` y `apiGetMisPagos` ya están implementados en `src/hooks/usePagos.ts` y `src/api/compliance.ts`. Solo falta usarlos en estas pantallas cuando se implemente.

---

## PublicarArticulo / MisProductos

| Pantalla | Estado | Motivo |
|----------|--------|--------|
| PublicarArticulo | Mock (solo Alert) | `POST /api/productos` existe (`ProductoController.java:36`) pero la entidad `Producto` exige FKs no nullables: `revisor` (Empleado) y `duenio` (Duenio) (`Producto.java:45-51`). Sin seedear esas tablas, el POST falla. |
| MisProductos | Lista vacía | La tabla `productos` no está seedeada (v8 nota al pie). |

---

## Cadena de pujas — ROTA (alta prioridad)

El detalle de subasta muestra **"No conectado — necesitás un medio de pago verificado para pujar"**, pero ese mensaje es engañoso. La causa real es otra:

### Causa raíz
El seed V8 deja `usuario_auth.persona_id = NULL` para el postor (línea 20 de `V8__seed_test_data.sql`).
`conectarASubasta` en `AuctionRuntimeService.java:86` llama a `getClienteFromEmail()` que requiere `usuario.getPersonaId() != null`, y lanza `"Usuario sin persona asociada"`.

### Para que pujar funcione hay que seedear (en orden):
1. **`persona`** — una fila con nombre/documento del postor de prueba.
2. **`usuario_auth.persona_id`** — actualizar el postor (id=2) para que apunte a la persona creada.
3. **`cliente`** — fila con `persona_id` de arriba, `admitido='si'`, `categoria='Plata'` (o mayor).
4. **`asistente`** — fila con `cliente_id` + `subasta_id` (para cada subasta que se quiera probar).
5. **`catalogo`** — fila con `subasta_id`.
6. **`item_catalogo`** — fila con `catalogo_id` y `precio_base` (número decimal).
7. La subasta destino debe estar `estado='ABIERTA'` y con fecha/hora dentro de la ventana actual (`ahora ∈ [inicio, inicio+duracion]`).
8. `subasta_config_ext` ya está seedeada (moneda por subasta).

> Los schemas de esas tablas los genera Hibernate (`ddl-auto: update`) desde las entidades Java en
> `SubastaTrabajoPractico/src/main/java/com/auctionsystem/entities/`
> (Persona, Cliente, Asistente, Catalogo, ItemCatalogo). No están en migraciones Flyway.
> Para ver columnas exactas: leer esas entidades o hacer `DESCRIBE <tabla>` en el contenedor MySQL.

---

## Resumen de endpoints faltantes en el backend

| Endpoint | Pantallas que lo necesitan |
|----------|---------------------------|
| `GET /api/auth/payment-methods` | Billetera (lista), FinalizarCompra (métodos) |
| Endpoint de saldo/balance | Billetera |
| Endpoint de estadísticas de usuario | Cuenta (stats + nivel) |
| Endpoint de detalle de adjudicación | DetalleAdjudicacion |
| Seed completo de pujas (Persona/Cliente/Asistente/Catálogo/Items) | DetalleSubasta (conectar/pujar) |
