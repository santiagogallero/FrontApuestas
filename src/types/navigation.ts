export type ScreenName =
  | 'splash'
  | 'login'
  | 'register'
  | 'verifyEmail'
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
  | 'detalleAdjudicacion'
  | 'finalizarCompra'
  | 'pagoExitoso'
  | 'pagoFallido'
  | 'chatSoporte';

export type ScreenParams = {
  splash: undefined;
  login: undefined;
  register: undefined;
  verifyEmail: { email: string };
  accountPending: undefined;
  recuperarCuenta: undefined;
  subastas: undefined;
  detalleSubasta: { subasta: Subasta } | { item: Subasta };
  billetera: undefined;
  ventas: undefined;
  cuenta: undefined;
  ajustes: undefined;
  seguros: undefined;
  misProductos: undefined;
  detalleAdjudicacion: undefined;
  finalizarCompra: undefined;
  pagoExitoso: undefined;
  pagoFallido: undefined;
  chatSoporte: undefined;
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
