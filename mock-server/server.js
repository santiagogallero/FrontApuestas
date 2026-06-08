const http = require('http');
const url = require('url');

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
  { id: 1, fecha: '2026-06-15', hora: '10:00:00', estado: 'ACTIVA', categoria: 'Oro', ubicacion: 'Salón Principal - Buenos Aires', capacidadAsistentes: 150 },
  { id: 2, fecha: '2026-06-18', hora: '14:30:00', estado: 'PENDIENTE', categoria: 'Plata', ubicacion: 'Sede Córdoba - Centro de Convenciones', capacidadAsistentes: 80 },
  { id: 3, fecha: '2026-06-20', hora: '11:00:00', estado: 'ACTIVA', categoria: 'Común', ubicacion: 'Online - Streaming', capacidadAsistentes: 500 },
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
  { registroSubastaId: 101, estadoPago: 'PENDIENTE', montoOfertado: 150000, montoMulta: 0, fechaVencimiento: '2026-06-20T23:59:59', fechaLimiteRegularizacion: '2026-06-23T23:59:59', bloqueado: false },
  { registroSubastaId: 102, estadoPago: 'PAGADO', montoOfertado: 85000, montoMulta: 0, fechaVencimiento: '2026-05-15T23:59:59', fechaLimiteRegularizacion: null, bloqueado: false },
  { registroSubastaId: 103, estadoPago: 'VENCIDO', montoOfertado: 320000, montoMulta: 32000, fechaVencimiento: '2026-04-10T23:59:59', fechaLimiteRegularizacion: '2026-04-13T23:59:59', bloqueado: true },
  { registroSubastaId: 104, estadoPago: 'PENDIENTE', montoOfertado: 45000, montoMulta: 0, fechaVencimiento: '2026-07-01T23:59:59', fechaLimiteRegularizacion: '2026-07-04T23:59:59', bloqueado: false },
];

let pujaCounter = 1;
let currentOffer = 15000;

// ─── Helpers ───
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
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
    sendJson(res, 200, { id: user.id, email: user.email, estado: user.estado, personaId: user.personaId, roles: user.roles });
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

  if (pathname.startsWith('/api/subastas/') && method === 'GET') {
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

  if (pathname === '/api/auction-runtime/pujas' && method === 'POST') {
    const body = await readBody(req);
    const importe = body.importe || 0;
    const ofertaAnterior = currentOffer;
    currentOffer = Math.max(currentOffer, importe);
    const minimo = Math.ceil(currentOffer * 1.01);
    const maximo = Math.ceil(currentOffer * 1.20);
    sendJson(res, 200, {
      pujoId: pujaCounter++,
      itemId: body.itemId || 1,
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

  // Compliance
  if (pathname === '/api/compliance/mis-pagos' && method === 'GET') {
    sendJson(res, 200, PAGOS);
    return;
  }

  // Health
  if (pathname === '/api/health' && method === 'GET') {
    sendJson(res, 200, { status: 'UP' });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
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
  console.log('  GET  /api/productos');
  console.log('  GET  /api/compliance/mis-pagos');
  console.log('  GET  /api/health');
  console.log('');
  console.log('👤 Usuarios que funcionan:');
  console.log('  postor@auction.com     / Postor123!    (POSTOR, PLATA)');
  console.log('  oro@auction.com        / Postor123!    (POSTOR, ORO)');
  console.log('  comun@auction.com      / Postor123!    (POSTOR, COMUN)');
  console.log('  moderador@auction.com  / Mod123!       (MODERADOR, PLATINO)');
  console.log('  admin@auction.com      / Admin123!     (ADMIN, PLATINO)');
  console.log('');
  console.log('❌ Usuarios que fallan:');
  console.log('  inactivo@auction.com   / Inactivo123!  → 403 Cuenta inactiva');
  console.log('  bloqueado@auction.com  / Bloqueado123! → 403 Cuenta bloqueada');
  console.log('  suspendido@auction.com / Suspendido123!→ 403 Cuenta suspendida');
  console.log('  cualquiera             / wrongpass     → 401 Credenciales inválidas');
});
