# Rediseño de UI — Auction Pulse Pro

Documento técnico del rediseño visual de la aplicación móvil (React Native + Expo) para
alinear todas las pantallas con el diseño de referencia en Figma (archivo *TP-DAI*).

## Objetivo

Unificar el lenguaje visual de la app con el diseño aprobado: logo de marca,
iconografía vectorial consistente, tarjetas con sombra, jerarquía tipográfica y
paleta de color únicas en todas las pantallas. Se eliminó por completo el uso de
emojis como iconografía, reemplazándolos por iconos SVG propios.

## Sistema de diseño

### Paleta (`src/theme/colors.ts`)
- **Primario:** `#0052FF` (azul de marca, usado en logo, botones, acentos y estado activo).
- **Fondo:** `#F8FAFC`. **Texto:** `#0F172A` / grises `#64748B`, `#94A3B8`, `#CBD5E1`.
- **Estados:** verde `#059669` (éxito/verificado), rojo `#DC2626` (error/penalización),
  naranja `#F59E0B` (en revisión). Cada uno con su variante clara.

### Tipografía (`src/theme/typography.ts`)
- Títulos de pantalla `h1` 34–40, encabezados de tarjeta 18–20, labels 12 (mayúsculas,
  *letter-spacing*), cuerpo 15. Pesos `700`–`900` para títulos.

### Iconografía (`src/components/icons.tsx`)
Set propio de ~32 iconos SVG construidos con `react-native-svg` (trazo redondeado,
`viewBox 0 0 24 24`). Incluye: gavel (martillo de subasta), escudo, cámara, documento,
sobre, tarjeta, banco, billetera, usuario, campana, engranaje, candado, ojo, arroba,
chevrones, check, alerta, etc. Todos parametrizables por `size`, `color` y `strokeWidth`.

### Logo (`src/components/Logo.tsx`)
Martillo de subasta dibujado en SVG (reemplaza el ícono anterior). Reutilizable en
encabezados, splash y como ícono de la pestaña *Subastas*.

## Componentes compartidos

| Componente | Cambio |
|------------|--------|
| `Logo` | Reescrito como gavel SVG, props `size`/`color`/`strokeWidth`. |
| `AppHeader` | Título alineado a la izquierda junto al logo; modo "atrás" con flecha SVG. |
| `BottomNav` | Iconos SVG (gavel, tendencia, billetera, usuario) y *pill* azul en la pestaña activa. |
| `AppInput` | Acepta iconos SVG (`ReactNode`) además de texto y soporta ícono derecho accionable (ej. mostrar/ocultar contraseña). |
| `AppSelect` | **Nuevo.** Desplegable con modal de selección (país, banco, categoría, etc.). |

## Pantallas

### Rediseñadas (19)
Splash, Login, Registro 1/2, Registro 2/2, Recuperar cuenta, Cuenta en verificación,
Subastas, Detalle de subasta, Historial de ofertas (Ventas), Mis productos, Cuenta,
Billetera, Ajustes, Seguros, Finalizar compra, Pago exitoso, Pago fallido,
Detalle de adjudicación y Soporte (chat).

Aspectos comunes aplicados: tarjetas blancas con sombra, *eyebrow* en mayúsculas,
títulos con jerarquía, badges de estado con color semántico y reemplazo de emojis por
iconos SVG.

### Nuevas (8)
- **Publicar artículo** — formulario de alta de lote (título, categoría, descripción, historia).
- **Agregar método de pago** — *hub* con tres opciones (banco / tarjeta / cheque).
- **Agregar tarjeta** — formulario con tarjeta visual y datos.
- **Agregar cuenta bancaria** — titular, banco, tipo de cuenta, CBU, país y divisa.
- **Verificación de cheque** — flujo en dos pasos (carga de imágenes + monto/número).
- **Estados:** Falta método de pago, Acceso Platino requerido y Usuario habilitado.

## Navegación

El enrutado es un `switch` por estado en `src/navigation/Navigator.tsx`, con los nombres
y parámetros tipados en `src/types/navigation.ts`. Conexiones agregadas:
- Billetera → *Agregar método de pago* → (banco / tarjeta / cheque).
- Mis productos → botón **+** → *Publicar artículo*.

## Dependencias

Se incorporó **`react-native-svg`** (instalada con `npx expo install`) para toda la
iconografía y el logo.

## Cómo ejecutar

```bash
npm install
npx expo start --port 8082
```

Backend (Docker) y credenciales de prueba en `GUIA_DE_PRUEBAS.md`.

## Verificación

Tras cada conjunto de cambios se validó:
- `npx tsc --noEmit` sin errores de tipos.
- Empaquetado de Metro correcto (`/index.bundle?platform=android` → HTTP 200).
