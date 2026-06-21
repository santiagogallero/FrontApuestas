const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = 8080;

// ─── Datos de prueba ───
const USERS = {
  // ── Usuarios que funcionan ──
  'postor@auction.com': {
    password: 'Postor123!',
    id: 2, email: 'postor@auction.com', estado: 'ACTIVO',
    personaId: 2, roles: ['POSTOR'], categoria: 'PLATA',
  },
  'admin@auction.com': {
    password: 'Admin123!',
    id: 1, email: 'admin@auction.com', estado: 'ACTIVO',
    personaId: 1, roles: ['ADMIN'], categoria: 'PLATINO',
  },
  'oro@auction.com': {
    password: 'Postor123!',
    id: 3, email: 'oro@auction.com', estado: 'ACTIVO',
    personaId: 3, roles: ['POSTOR'], categoria: 'ORO',
  },
  'comun@auction.com': {
    password: 'Postor123!',
    id: 4, email: 'comun@auction.com', estado: 'ACTIVO',
    personaId: 4, roles: ['POSTOR'], categoria: 'COMUN',
  },
  'moderador@auction.com': {
    password: 'Mod123!',
    id: 5, email: 'moderador@auction.com', estado: 'ACTIVO',
    personaId: 5, roles: ['MODERADOR'], categoria: 'PLATINO',
  },
  'empleado@auction.com': {
    password: 'Empleado123!',
    id: 6, email: 'empleado@auction.com', estado: 'ACTIVO',
    personaId: 6, roles: ['EMPLEADO'], categoria: 'PLATINO',
  },

  // ── Usuarios que fallan ──
  'inactivo@auction.com': {
    password: 'Inactivo123!',
    id: 10, email: 'inactivo@auction.com', estado: 'INACTIVO',
    personaId: 10, roles: ['POSTOR'], categoria: 'COMUN',
  },
  'bloqueado@auction.com': {
    password: 'Bloqueado123!',
    id: 11, email: 'bloqueado@auction.com', estado: 'BLOQUEADO',
    personaId: 11, roles: ['POSTOR'], categoria: 'PLATA',
  },
  'suspendido@auction.com': {
    password: 'Suspendido123!',
    id: 12, email: 'suspendido@auction.com', estado: 'SUSPENDIDO',
    personaId: 12, roles: ['POSTOR'], categoria: 'ORO',
  },
};

// token → email del usuario logueado
const tokenStore = {};

const SUBASTAS = [
  { id: 1, fecha: '2026-06-15', hora: '10:00:00', estado: 'ACTIVA', categoria: 'Oro', ubicacion: 'Salón Principal - Buenos Aires', capacidadAsistentes: 150, streamingUrl: 'https://streaming.example/live/1', depositoNombre: 'Depósito Norte', depositoDireccion: 'Av. del Libertador 5800, CABA' },
  { id: 2, fecha: '2026-06-18', hora: '14:30:00', estado: 'PENDIENTE', categoria: 'Plata', ubicacion: 'Sede Córdoba - Centro de Convenciones', capacidadAsistentes: 80 },
  { id: 3, fecha: '2026-06-20', hora: '11:00:00', estado: 'ACTIVA', categoria: 'Común', ubicacion: 'Salón Colecciones - Palermo', capacidadAsistentes: 500, streamingUrl: 'https://streaming.example/live/coleccion-postor', depositoNombre: 'Depósito Central', depositoDireccion: 'Av. Industria 3200, CABA' },
  { id: 4, fecha: '2026-06-25', hora: '09:00:00', estado: 'PENDIENTE', categoria: 'Platino', ubicacion: 'Salón VIP - Mendoza', capacidadAsistentes: 50 },
  { id: 5, fecha: '2026-06-22', hora: '16:00:00', estado: 'CERRADA', categoria: 'Oro', ubicacion: 'Rosario - Centro Cultural', capacidadAsistentes: 120 },
];

const PRODUCTOS = [
  { id: 1, fecha: '2026-05-01', disponible: true, descripcionCatalogo: 'Reloj Patek Philippe Nautilus', descripcionCompleta: 'Edición limitada 2024, caja de acero, movimiento automático Calibre 26-330 S C' },
  { id: 2, fecha: '2026-05-10', disponible: true, descripcionCatalogo: 'Moneda de oro 8 escudos 1813', descripcionCompleta: 'Potosí, Fernando VII. Conservación MBC+/EBC-. Escasa' },
  { id: 3, fecha: '2026-04-20', disponible: false, descripcionCatalogo: 'Toyota Corolla 2020', descripcionCompleta: '35.000 km, único dueño, service al día, documentación completa' },
  { id: 4, fecha: '2026-05-15', disponible: true, descripcionCatalogo: 'Apple Watch Ultra II', descripcionCompleta: 'Titanio, GPS + Cellular, caja de 49mm, correa trail' },
  { id: 5, fecha: '2026-03-12', disponible: false, descripcionCatalogo: 'Juego de té de plata 18 piezas', descripcionCompleta: 'Estilo Art Déco, peso 1.2kg, marcas de contraste inglés' },
];

const PAGOS = [
  { registroSubastaId: 101, estadoPago: 'PENDIENTE', montoOfertado: 150000, montoTotal: 165000, montoMulta: 0, multaPotencial: 15000, moneda: 'ARS', productoDescripcion: 'Reloj Patek Philippe Nautilus', transaccionId: null, fechaVencimiento: '2026-06-20T23:59:59', fechaLimiteRegularizacion: null, bloqueado: false },
  { registroSubastaId: 102, estadoPago: 'PAGADO', montoOfertado: 85000, montoTotal: 93500, montoMulta: 0, multaPotencial: 8500, moneda: 'ARS', productoDescripcion: 'Moneda de oro 8 escudos', transaccionId: 'TXN-MOCK-102', fechaVencimiento: '2026-05-15T23:59:59', fechaLimiteRegularizacion: null, bloqueado: false },
  { registroSubastaId: 103, estadoPago: 'VENCIDO', montoOfertado: 320000, montoTotal: 352000, montoMulta: 32000, multaPotencial: 32000, moneda: 'ARS', productoDescripcion: 'Toyota Corolla 2020', transaccionId: null, fechaVencimiento: '2026-04-10T23:59:59', fechaLimiteRegularizacion: '2026-04-13T23:59:59', bloqueado: true },
  { registroSubastaId: 104, estadoPago: 'PENDIENTE', montoOfertado: 45000, montoTotal: 49500, montoMulta: 0, multaPotencial: 4500, moneda: 'ARS', productoDescripcion: 'Apple Watch Ultra II', transaccionId: null, fechaVencimiento: '2026-07-01T23:59:59', fechaLimiteRegularizacion: null, bloqueado: false },
  { registroSubastaId: 1, estadoPago: 'PENDIENTE', montoOfertado: 142000, montoTotal: 156200, montoMulta: 0, multaPotencial: 14200, moneda: 'ARS', productoDescripcion: 'Reloj Patek Philippe Nautilus', transaccionId: null, fechaVencimiento: '2026-07-15T23:59:59', fechaLimiteRegularizacion: null, bloqueado: false },
];

let payoutAccountCounter = 2;
const PAYOUT_ACCOUNTS = [
  { id: 1, alias: 'Galicia ARS', currency: 'ARS', foreignAccount: false, bankName: 'Banco Galicia', accountNumberMasked: '****7856', swiftCode: null, holderName: 'Juan Postor', active: true },
];

const MEDIOS_PAGO = [
  { id: 1, tipo: 'TARJETA_CREDITO', aliasDescripcion: 'Visa **** 4242', moneda: 'ARS', montoGarantia: null, verificado: true, activo: true },
  { id: 2, tipo: 'CUENTA_BANCARIA', aliasDescripcion: 'Cuenta Galicia **** 7856', moneda: 'ARS', montoGarantia: null, verificado: true, activo: true },
  { id: 3, tipo: 'CHEQUE_CERTIFICADO', aliasDescripcion: 'Cheque certificado Banco Nación', moneda: 'ARS', montoGarantia: 500000, verificado: false, activo: true },
];

const ADJUDICACIONES = [
  { registroId: 1, itemId: null, productoId: 1, productoDescripcion: 'Reloj Patek Philippe Nautilus', ganadorClienteId: 2, ganadorNombre: 'Juan Postor', importe: 142000, comision: 14200, costoEnvio: 0, totalPagar: 156200, moneda: 'ARS', estado: 'VENDIDO', mensaje: 'Adjudicacion registrada. Total a pagar: 156200 ARS.', modalidadEntrega: null, direccionEnvio: null, seguroVigenteTrasEntrega: null },
];

const COLECCIONES = [
  { id: 1, nombre: 'Colección Juan Postor', subastaId: 3, cantidadPiezas: 2, duenioNombre: 'Juan Postor', duenioId: 2, productoIds: [1, 2] },
];

let pujaCounter = 1;
let currentOffer = 15000;

// ─── Artículos (venta de artículo propio + inspección) ───
// _ownerEmail es interno y se omite en las respuestas.
let articuloCounter = 100;
const ARTICULOS = [
  {
    id: 91, titulo: 'Pintura al óleo - Paisaje patagónico', categoria: 'Arte',
    descripcionCatalogo: 'Pintura al óleo - Paisaje patagónico',
    descripcionCompleta: 'Óleo sobre lienzo, 80x60cm, firmado al dorso. Heredado de un coleccionista privado.',
    historia: 'Adquirido en una galería de Bariloche en 1995. Sin restauraciones. Incluye certificado de autenticidad.',
    estadoInspeccion: 'PENDIENTE', motivoRechazo: null, disponible: false,
    fecha: '2026-06-18', fechaInspeccion: null, duenioNombre: 'Juan Postor', revisorNombre: null,
    cantidadFotos: 2, declaraPropiedad: true, origenLicit: true, _ownerEmail: 'postor@auction.com',
  },
  {
    id: 92, titulo: 'Reloj de colección suizo', categoria: 'Relojería de Lujo',
    descripcionCatalogo: 'Reloj de colección suizo, edición limitada',
    descripcionCompleta: 'Reloj automático de colección, caja de acero, fabricado en 1968. Excelente estado.',
    historia: 'Procedente de una colección privada europea, con caja y papeles originales.',
    estadoInspeccion: 'APROBADO', motivoRechazo: null, disponible: true,
    fecha: '2026-06-10', fechaInspeccion: '2026-06-12T10:00:00', duenioNombre: 'Juan Postor', revisorNombre: 'Empleado Tasador',
    cantidadFotos: 6, declaraPropiedad: true, origenLicit: true, _ownerEmail: 'postor@auction.com',
  },
];

const MOCK_SEGUROS = [
  {
    productoId: 92,
    productoTitulo: 'Reloj de colección suizo',
    nroPoliza: 'POL-MOCK-001',
    compania: 'Mercantil Andina SA',
    importeAsegurado: 85000,
    polizaCombinada: false,
    contactoTelefono: '+54 11 4321-9000',
    contactoEmail: 'siniestros@mercantil.example',
  },
];

function articuloPublico(a) {
  const { _ownerEmail, ...rest } = a;
  return rest;
}

// ─── Helpers ───
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

function getAuthEmail(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    return tokenStore[token] || null;
  }
  return null;
}

// ─── WebSocket (pujas en tiempo real, sin dependencias externas) ───
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const wsClients = new Map(); // subastaId (string) -> Set<socket>

function wsAccept(key) {
  return crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
}

function wsEncodeText(str) {
  const payload = Buffer.from(str);
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

function wsBroadcast(subastaId, obj) {
  const set = wsClients.get(String(subastaId));
  if (!set || set.size === 0) return;
  const frame = wsEncodeText(JSON.stringify(obj));
  for (const sock of set) {
    if (sock.writable) sock.write(frame);
  }
}

// ─── Server ───
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  console.log(`${method} ${pathname}`);

  // Auth
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await readBody(req);
    const user = USERS[body.email?.toLowerCase()];
    if (!user || user.password !== body.password) {
      sendJson(res, 401, { error: 'Credenciales inválidas' });
      return;
    }
    if (user.estado === 'INACTIVO') {
      sendJson(res, 403, { error: 'Cuenta inactiva. Contacte al administrador.' });
      return;
    }
    if (user.estado === 'BLOQUEADO') {
      sendJson(res, 403, { error: 'Cuenta bloqueada por incumplimiento de pagos.' });
      return;
    }
    if (user.estado === 'SUSPENDIDO') {
      sendJson(res, 403, { error: 'Cuenta suspendida temporalmente.' });
      return;
    }
    const token = `mock-token-${Date.now()}`;
    tokenStore[token] = user.email;
    sendJson(res, 200, { token, tokenType: 'Bearer', expiresInSeconds: 7200, roles: user.roles });
    return;
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const user = Object.values(USERS).find((u) => u.email === email) || USERS['postor@auction.com'];
    sendJson(res, 200, { id: user.id, email: user.email, estado: user.estado, personaId: user.personaId, roles: user.roles, categoria: user.categoria });
    return;
  }

  // Métodos de pago del usuario
  if (pathname === '/api/auth/payment-methods' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    sendJson(res, 200, MEDIOS_PAGO);
    return;
  }

  // Métricas del usuario
  if (pathname === '/api/metrics/me' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const user = Object.values(USERS).find((u) => u.email === email) || USERS['postor@auction.com'];
    sendJson(res, 200, {
      categoria: user.categoria,
      subastasParticipadas: 3,
      pujasRealizadas: 11,
      subastasGanadas: 2,
      totalOfertado: 287000,
      totalPagado: 142000,
    });
    return;
  }

  // Adjudicaciones del usuario
  if (pathname === '/api/auction-runtime/mis-adjudicaciones' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    sendJson(res, 200, ADJUDICACIONES);
    return;
  }

  const entregaMatch = pathname.match(/^\/api\/auction-runtime\/adjudicaciones\/(\d+)\/entrega$/);
  if (entregaMatch && method === 'POST') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const body = await readBody(req);
    const registroId = parseInt(entregaMatch[1]);
    const adj = ADJUDICACIONES.find((a) => a.registroId === registroId) || ADJUDICACIONES[0];
    const opcion = (body.deliveryOption || 'SHIPPED').toUpperCase();
    adj.modalidadEntrega = opcion;
    adj.direccionEnvio = opcion === 'PICKUP' ? null : (body.shippingAddress || 'Av. Corrientes 1234, CABA');
    adj.seguroVigenteTrasEntrega = opcion !== 'PICKUP';
    sendJson(res, 200, adj);
    return;
  }

  // Colecciones
  if (pathname === '/api/colecciones' && method === 'GET') {
    sendJson(res, 200, COLECCIONES.map(({ productoIds, duenioId, ...r }) => r));
    return;
  }

  const coleccionSubastaMatch = pathname.match(/^\/api\/colecciones\/por-subasta\/(\d+)$/);
  if (coleccionSubastaMatch && method === 'GET') {
    const subastaId = parseInt(coleccionSubastaMatch[1]);
    const col = COLECCIONES.find((c) => c.subastaId === subastaId);
    if (!col) { sendJson(res, 404, { error: 'Not found' }); return; }
    sendJson(res, 200, col);
    return;
  }

  // Cierre de item (adjudicación)
  if (pathname.match(/^\/api\/auction-runtime\/items\/\d+\/cerrar$/) && method === 'POST') {
    const itemId = parseInt(pathname.split('/')[4]);
    sendJson(res, 200, {
      registroId: 9001, itemId, productoId: 1, productoDescripcion: 'Reloj Patek Philippe Nautilus',
      ganadorClienteId: 2, ganadorNombre: 'Juan Postor', importe: currentOffer,
      comision: Math.round(currentOffer * 0.1), costoEnvio: 0,
      totalPagar: currentOffer + Math.round(currentOffer * 0.1), moneda: 'ARS', estado: 'VENDIDO',
      mensaje: 'Felicitaciones, te adjudicaste la pieza.',
    });
    return;
  }

  if (pathname === '/api/auth/register/stage1' && method === 'POST') {
    const body = await readBody(req);
    console.log('Stage1 registro:', body.email);
    sendJson(res, 200, 'Registro etapa 1 completado');
    return;
  }

  if (pathname === '/api/auth/register/stage2' && method === 'POST') {
    const body = await readBody(req);
    console.log('Stage2 registro:', body.email);
    sendJson(res, 200, 'Registro etapa 2 completado');
    return;
  }

  // Subastas
  if (pathname === '/api/subastas' && method === 'GET') {
    sendJson(res, 200, SUBASTAS);
    return;
  }

  const catalogoMatch = pathname.match(/^\/api\/subastas\/(\d+)\/catalogo$/);
  if (catalogoMatch && method === 'GET') {
    const subastaId = parseInt(catalogoMatch[1]);
    const autenticado = !!getAuthEmail(req);
    const items = subastaId === 3
      ? [
          { itemId: 10, productoId: 1, titulo: 'Anillo de oro con esmeralda', descripcion: 'Anillo de oro 18K', categoria: 'Joyería', precioBase: autenticado ? 75000 : null, moneda: 'ARS', tieneSeguro: true, duenioNombre: 'Juan Postor' },
          { itemId: 11, productoId: 2, titulo: 'Collar de perlas cultivadas', descripcion: 'Collar Akoya 45 cm', categoria: 'Joyería', precioBase: autenticado ? 42000 : null, moneda: 'ARS', tieneSeguro: false, duenioNombre: 'Juan Postor' },
        ]
      : [{
        itemId: 1,
        productoId: 1,
        titulo: 'Reloj Patek Philippe Nautilus',
        descripcion: PRODUCTOS[0].descripcionCompleta,
        categoria: 'Relojería de Lujo',
        precioBase: autenticado ? 10000 : null,
        moneda: 'ARS',
        tieneSeguro: true,
        duenioNombre: 'Dueño demo',
      }];
    sendJson(res, 200, {
      subastaId,
      catalogoId: 1,
      descripcion: subastaId === 3 ? 'Colección Juan Postor' : 'Catálogo de demo',
      moneda: 'ARS',
      items,
    });
    return;
  }

  if (pathname.match(/^\/api\/subastas\/\d+$/) && method === 'GET') {
    const id = parseInt(pathname.split('/').pop());
    const sub = SUBASTAS.find((s) => s.id === id);
    if (!sub) { sendJson(res, 404, { error: 'Not found' }); return; }
    sendJson(res, 200, sub);
    return;
  }

  // Auction Runtime
  if (pathname === '/api/auction-runtime/subasta/conectar' && method === 'POST') {
    sendJson(res, 200, 'Conexion a subasta realizada');
    return;
  }

  const streamingMatch = pathname.match(/^\/api\/auction-runtime\/subasta\/(\d+)\/streaming$/);
  if (streamingMatch && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const subastaId = parseInt(streamingMatch[1]);
    const sub = SUBASTAS.find((s) => s.id === subastaId);
    sendJson(res, 200, { subastaId, streamingUrl: sub?.streamingUrl || null });
    return;
  }

  if (pathname === '/api/auction-runtime/pujas' && method === 'POST') {
    const body = await readBody(req);
    const importe = body.importe || 0;
    const ofertaAnterior = currentOffer;
    currentOffer = Math.max(currentOffer, importe);
    const minimo = Math.ceil(currentOffer * 1.01);
    const maximo = Math.ceil(currentOffer * 1.20);
    const pujoId = pujaCounter++;
    const itemId = body.itemId || 1;

    const email = getAuthEmail(req);
    const user = Object.values(USERS).find((u) => u.email === email);
    const numeroPostor = user ? user.id : 99;
    const nombrePostor = email ? email.split('@')[0] : 'Postor';

    // Difusión en tiempo real a los demás postores conectados a la subasta.
    wsBroadcast(body.subastaId, {
      tipo: 'NUEVA_PUJA',
      subastaId: body.subastaId,
      itemId,
      pujoId,
      numeroPostor,
      nombrePostor,
      importe: currentOffer,
      minimoPermitido: minimo,
      maximoPermitido: maximo,
      timestamp: new Date().toISOString(),
    });

    sendJson(res, 200, {
      pujoId,
      itemId,
      ofertaAnterior: ofertaAnterior,
      ofertaActual: currentOffer,
      minimoPermitido: minimo,
      maximoPermitido: maximo,
      mensaje: 'Puja registrada exitosamente',
    });
    return;
  }

  if (pathname.startsWith('/api/auction-runtime/pujas/historial/') && method === 'GET') {
    sendJson(res, 200, []);
    return;
  }

  // Productos
  if (pathname === '/api/productos' && method === 'GET') {
    sendJson(res, 200, PRODUCTOS);
    return;
  }

  // Artículos: publicar uno propio (queda PENDIENTE de inspección)
  if (pathname === '/api/articulos' && method === 'POST') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const body = await readBody(req);
    if (!body.titulo || !body.descripcionCompleta) {
      sendJson(res, 400, { message: 'El título y la descripción son obligatorios' });
      return;
    }
    if (!body.declaraPropiedad || !body.origenLicit) {
      sendJson(res, 400, { message: 'Debe aceptar las declaraciones de propiedad y origen lícito' });
      return;
    }
    const cantidadFotos = Array.isArray(body.fotos) ? body.fotos.length : 0;
    if (cantidadFotos < 6) {
      sendJson(res, 400, { message: 'Debe adjuntar al menos 6 fotos del articulo' });
      return;
    }
    const user = Object.values(USERS).find((u) => u.email === email);
    const nuevo = {
      id: articuloCounter++,
      titulo: body.titulo,
      categoria: body.categoria || null,
      descripcionCatalogo: body.titulo,
      descripcionCompleta: body.descripcionCompleta,
      historia: body.historia || null,
      estadoInspeccion: 'PENDIENTE',
      motivoRechazo: null,
      disponible: false,
      fecha: new Date().toISOString().slice(0, 10),
      fechaInspeccion: null,
      duenioNombre: user ? user.email.split('@')[0] : 'Postor',
      revisorNombre: null,
      cantidadFotos,
      declaraPropiedad: true,
      origenLicit: true,
      _ownerEmail: email,
    };
    ARTICULOS.push(nuevo);
    sendJson(res, 201, articuloPublico(nuevo));
    return;
  }

  // Artículos: los míos
  if (pathname === '/api/articulos/mios' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const mios = ARTICULOS.filter((a) => a._ownerEmail === email).reverse().map(articuloPublico);
    sendJson(res, 200, mios);
    return;
  }

  // Artículos: cola de inspección (empleado/admin)
  if (pathname === '/api/articulos/pendientes' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const pendientes = ARTICULOS.filter((a) => a.estadoInspeccion === 'PENDIENTE').map(articuloPublico);
    sendJson(res, 200, pendientes);
    return;
  }

  // Artículos: inspección (aprobar / rechazar)
  const inspMatch = pathname.match(/^\/api\/articulos\/(\d+)\/inspeccion$/);
  if (inspMatch && method === 'POST') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const id = parseInt(inspMatch[1]);
    const articulo = ARTICULOS.find((a) => a.id === id);
    if (!articulo) { sendJson(res, 404, { message: 'Artículo no encontrado' }); return; }
    if (articulo.estadoInspeccion !== 'PENDIENTE') {
      sendJson(res, 400, { message: 'El artículo ya fue inspeccionado' });
      return;
    }
    const body = await readBody(req);
    if (!body.aprobado && !(body.motivo && body.motivo.trim())) {
      sendJson(res, 400, { message: 'Debe indicar el motivo del rechazo' });
      return;
    }
    const user = Object.values(USERS).find((u) => u.email === email);
    articulo.revisorNombre = user ? user.email.split('@')[0] : 'Inspector';
    articulo.fechaInspeccion = new Date().toISOString();
    if (body.aprobado) {
      articulo.estadoInspeccion = 'APROBADO';
      articulo.disponible = true;
      articulo.motivoRechazo = null;
    } else {
      articulo.estadoInspeccion = 'RECHAZADO';
      articulo.disponible = false;
      articulo.motivoRechazo = body.motivo.trim();
    }
    sendJson(res, 200, articuloPublico(articulo));
    return;
  }

  // Compliance
  if (pathname === '/api/compliance/mis-pagos' && method === 'GET') {
    sendJson(res, 200, PAGOS);
    return;
  }

  const checkoutMatch = pathname.match(/^\/api\/compliance\/pagos\/checkout\/(\d+)$/);
  if (checkoutMatch && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const registroId = parseInt(checkoutMatch[1]);
    let pago = PAGOS.find((p) => p.registroSubastaId === registroId);
    if (!pago) {
      const adj = ADJUDICACIONES.find((a) => a.registroId === registroId);
      if (adj) {
        pago = {
          registroSubastaId: registroId,
          estadoPago: 'PENDIENTE',
          montoOfertado: adj.importe,
          montoTotal: adj.totalPagar,
          montoMulta: 0,
          multaPotencial: Math.round(adj.importe * 0.1),
          moneda: adj.moneda,
          productoDescripcion: adj.productoDescripcion,
          transaccionId: null,
          fechaVencimiento: new Date(Date.now() + 72 * 3600000).toISOString(),
          fechaLimiteRegularizacion: null,
          bloqueado: false,
        };
        PAGOS.push(pago);
      }
    }
    if (!pago) { sendJson(res, 404, { message: 'Adjudicacion no encontrada' }); return; }
    sendJson(res, 200, pago);
    return;
  }

  if (pathname === '/api/compliance/pagos/ejecutar' && method === 'POST') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const body = await readBody(req);
    const medio = MEDIOS_PAGO.find((m) => m.id === body.medioPagoId);
    if (!medio) { sendJson(res, 400, { message: 'Medio de pago no encontrado' }); return; }
    if (!medio.verificado || !medio.activo) {
      sendJson(res, 400, { message: 'El medio de pago no esta verificado' });
      return;
    }
    const pago = PAGOS.find((p) => p.registroSubastaId === body.registroSubastaId);
    if (!pago) { sendJson(res, 400, { message: 'No hay pago pendiente' }); return; }
    if (pago.estadoPago === 'PAGADO') { sendJson(res, 400, { message: 'Ya fue pagado' }); return; }
    const montoPagado = pago.estadoPago === 'VENCIDO' ? pago.montoTotal + pago.montoMulta : pago.montoTotal;
    const txnId = 'TXN-MOCK-' + Date.now();
    pago.estadoPago = 'PAGADO';
    pago.transaccionId = txnId;
    pago.bloqueado = false;
    sendJson(res, 200, {
      exito: true,
      transaccionId: txnId,
      montoPagado,
      moneda: pago.moneda,
      productoDescripcion: pago.productoDescripcion,
      medioPagoAlias: medio.aliasDescripcion,
      fechaPago: new Date().toISOString(),
    });
    return;
  }

  if (pathname === '/api/payout-accounts' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    sendJson(res, 200, PAYOUT_ACCOUNTS.filter((c) => c.active));
    return;
  }

  if (pathname === '/api/payout-accounts' && method === 'POST') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const body = await readBody(req);
    const masked = '****' + String(body.accountNumber || '').slice(-4);
    const cuenta = {
      id: ++payoutAccountCounter,
      alias: body.alias,
      currency: body.currency,
      foreignAccount: !!body.foreignAccount,
      bankName: body.bankName,
      accountNumberMasked: masked,
      swiftCode: body.swiftCode || null,
      holderName: body.holderName,
      active: true,
    };
    PAYOUT_ACCOUNTS.push(cuenta);
    sendJson(res, 201, cuenta);
    return;
  }

  const payoutDeleteMatch = pathname.match(/^\/api\/payout-accounts\/(\d+)$/);
  if (payoutDeleteMatch && method === 'DELETE') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    const id = parseInt(payoutDeleteMatch[1]);
    const cuenta = PAYOUT_ACCOUNTS.find((c) => c.id === id);
    if (!cuenta) { sendJson(res, 404, { message: 'No encontrada' }); return; }
    cuenta.active = false;
    sendJson(res, 204, null);
    return;
  }

  // Health
  if (pathname === '/api/health' && method === 'GET') {
    sendJson(res, 200, { status: 'UP' });
    return;
  }

  if (pathname === '/api/seguros/mios' && method === 'GET') {
    const email = getAuthEmail(req);
    if (!email) { sendJson(res, 401, { error: 'Unauthorized' }); return; }
    sendJson(res, 200, email === 'postor@auction.com' ? MOCK_SEGUROS : []);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

// ─── Handshake WebSocket ───
server.on('upgrade', (req, socket) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/ws/subastas') {
    socket.destroy();
    return;
  }
  const key = req.headers['sec-websocket-key'];
  if (!key) {
    socket.destroy();
    return;
  }
  const subastaId = String(parsed.query.subastaId || '');
  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${wsAccept(key)}`,
    ].join('\r\n') + '\r\n\r\n'
  );

  if (!wsClients.has(subastaId)) wsClients.set(subastaId, new Set());
  wsClients.get(subastaId).add(socket);
  console.log(`🔌 WS conectado a subasta ${subastaId} (clientes=${wsClients.get(subastaId).size})`);

  socket.on('data', (buf) => {
    // Frame de cierre (opcode 0x8): cerramos la conexión.
    if (buf.length > 0 && (buf[0] & 0x0f) === 0x8) socket.end();
  });

  const cleanup = () => {
    const set = wsClients.get(subastaId);
    if (set) {
      set.delete(socket);
      if (set.size === 0) wsClients.delete(subastaId);
    }
  };
  socket.on('close', cleanup);
  socket.on('error', cleanup);
});

server.listen(PORT, () => {
  console.log(`🚀 Mock Auction Backend corriendo en http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/me');
  console.log('  POST /api/auth/register/stage1');
  console.log('  POST /api/auth/register/stage2');
  console.log('  GET  /api/subastas');
  console.log('  GET  /api/subastas/:id');
  console.log('  POST /api/auction-runtime/subasta/conectar');
  console.log('  POST /api/auction-runtime/pujas');
  console.log('  WS   /ws/subastas?subastaId=:id  (pujas en tiempo real)');
  console.log('  GET  /api/productos');
  console.log('  POST /api/articulos                    (publicar artículo propio)');
  console.log('  GET  /api/articulos/mios               (mis artículos)');
  console.log('  GET  /api/articulos/pendientes         (cola de inspección)');
  console.log('  POST /api/articulos/:id/inspeccion     (aprobar/rechazar)');
  console.log('  GET  /api/compliance/mis-pagos');
  console.log('  GET  /api/health');
  console.log('');
  console.log('👤 Usuarios que funcionan:');
  console.log('  postor@auction.com     / Postor123!    (POSTOR, PLATA)');
  console.log('  oro@auction.com        / Postor123!    (POSTOR, ORO)');
  console.log('  comun@auction.com      / Postor123!    (POSTOR, COMUN)');
  console.log('  moderador@auction.com  / Mod123!       (MODERADOR, PLATINO)');
  console.log('  empleado@auction.com   / Empleado123!  (EMPLEADO, inspección)');
  console.log('  admin@auction.com      / Admin123!     (ADMIN, PLATINO)');
  console.log('');
  console.log('❌ Usuarios que fallan:');
  console.log('  inactivo@auction.com   / Inactivo123!  → 403 Cuenta inactiva');
  console.log('  bloqueado@auction.com  / Bloqueado123! → 403 Cuenta bloqueada');
  console.log('  suspendido@auction.com / Suspendido123!→ 403 Cuenta suspendida');
  console.log('  cualquiera             / wrongpass     → 401 Credenciales inválidas');
});
