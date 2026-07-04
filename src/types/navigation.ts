export type ScreenName =
  | 'splash'
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'registerStage2'
  | 'accountPending'
  | 'recuperarCuenta'
  | 'subastas'
  | 'detalleSubasta'
  | 'billetera'
  | 'ventas'
  | 'cuenta'
  | 'ajustes'
  | 'seguros'
  | 'misProductos'
  | 'inspeccion'
  | 'detalleAdjudicacion'
  | 'finalizarCompra'
  | 'pagoExitoso'
  | 'pagoFallido'
  | 'chatSoporte'
  | 'publicarArticulo'
  | 'agregarMetodoPago'
  | 'agregarTarjeta'
  | 'agregarCuentaBancaria'
  | 'verificarCheque'
  | 'faltaMetodoPago'
  | 'accesoPlatino'
  | 'usuarioHabilitado'
  | 'cuentasCobro'
  | 'adminChats'
  | 'crearSubasta';

export type ScreenParams = {
  splash: undefined;
  login: undefined;
  register: undefined;
  verifyEmail: { email: string };
  registerStage2: { email: string };
  accountPending: undefined;
  recuperarCuenta: undefined;
  subastas: undefined;
  detalleSubasta: { subasta: Subasta } | { item: Subasta };
  billetera: undefined;
  ventas: undefined;
  cuenta: undefined;
  ajustes: undefined;
  seguros: undefined;
  misProductos: { backTo?: 'chatSoporte'; chatParams?: ScreenParams['chatSoporte'] } | undefined;
  inspeccion: { backTo?: 'chatSoporte'; chatParams?: ScreenParams['chatSoporte'] } | undefined;
  detalleAdjudicacion: undefined;
  finalizarCompra: { registroId: number };
  pagoExitoso: {
    registroId: number;
    transaccionId: string;
    montoPagado: number;
    moneda: string;
    productoDescripcion: string | null;
    medioPagoAlias: string;
  };
  pagoFallido: {
    registroId: number;
    multaPotencial: number;
    moneda: string;
    mensaje?: string;
  };
  chatSoporte: {
    conversacionId: number;
    titulo?: string;
    productoId?: number;
    productoTitulo?: string;
    productoEstado?: string;
    productoMotivo?: string;
  };
  adminChats: undefined;
  crearSubasta: undefined;
  publicarArticulo: undefined;
  agregarMetodoPago: undefined;
  agregarTarjeta: undefined;
  agregarCuentaBancaria: undefined;
  verificarCheque: undefined;
  faltaMetodoPago: undefined;
  accesoPlatino: undefined;
  usuarioHabilitado: undefined;
  cuentasCobro: undefined;
};

import type { Subasta } from './subasta';

export interface NavState {
  screen: ScreenName;
  params?: ScreenParams[ScreenName];
}

export type NavigateFn = <S extends ScreenName>(
  screen: S,
  params?: ScreenParams[S]
) => void;
