import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  VerifyEmailScreen,
  RegisterStage2Screen,
  AccountPendingScreen,
  RecuperarCuentaScreen,
  SubastasScreen,
  DetalleSubastaScreen,
  BilleteraScreen,
  VentasScreen,
  CuentaScreen,
  AjustesScreen,
  SegurosScreen,
  MisProductosScreen,
  InspeccionScreen,
  DetalleAdjudicacionScreen,
  FinalizarCompraScreen,
  PagoExitosoScreen,
  PagoFallidoScreen,
  ChatSoporteScreen,
  PublicarArticuloScreen,
  AgregarMetodoPagoScreen,
  AgregarTarjetaScreen,
  AgregarCuentaBancariaScreen,
  VerificarChequeScreen,
  FaltaMetodoPagoScreen,
  AccesoPlatinoScreen,
  UsuarioHabilitadoScreen,
  CuentasCobroScreen,
  AdminChatsScreen,
  CrearSubastaScreen,
} from '../screens';
import type { ScreenName, ScreenParams, NavState, NavigateFn } from '../types/navigation';

export function Navigator() {
  const [nav, setNav] = useState<NavState>({ screen: 'splash' });
  const [guest, setGuest] = useState(false);
  const { isLoading, token, currentUser } = useAuthContext();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('EMPLEADO');

  const AUTH_SCREENS: ScreenName[] = ['login', 'register', 'verifyEmail', 'registerStage2', 'accountPending', 'recuperarCuenta'];
  const GUEST_SCREENS: ScreenName[] = ['subastas', 'detalleSubasta', ...AUTH_SCREENS];

  useEffect(() => {
    if (isLoading) return;
    if (nav.screen === 'splash') {
      if (token) {
        setNav({ screen: isAdmin ? 'adminChats' : 'subastas' });
      } else {
        setNav({ screen: 'login' });
      }
      return;
    }
    if (!token && !guest && !AUTH_SCREENS.includes(nav.screen)) {
      setNav({ screen: 'login' });
    }
  }, [isLoading, token, guest, nav.screen]);

  useEffect(() => {
    if (!token) setGuest(false);
  }, [token]);

  const navigate: NavigateFn = (screen, params) => {
    if (screen === 'login') { setGuest(false); setNav({ screen }); return; }
    if (guest && !GUEST_SCREENS.includes(screen)) { setGuest(false); setNav({ screen: 'login' }); return; }
    setNav({ screen, params } as NavState);
  };

  const navigateAsGuest: NavigateFn = (screen, params) => {
    setGuest(true);
    setNav({ screen, params } as NavState);
  };

  const { screen, params } = nav;

  switch (screen) {
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <LoginScreen onNavigate={navigate} onNavigateAsGuest={navigateAsGuest} />;
    case 'register':
      return <RegisterScreen onNavigate={navigate} />;
    case 'verifyEmail':
      return <VerifyEmailScreen onNavigate={navigate} params={params as ScreenParams['verifyEmail']} />;
    case 'registerStage2':
      return <RegisterStage2Screen onNavigate={navigate} params={params as ScreenParams['registerStage2']} />;
    case 'accountPending':
      return <AccountPendingScreen onNavigate={navigate} />;
    case 'recuperarCuenta':
      return <RecuperarCuentaScreen onNavigate={navigate} />;
    case 'subastas':
      return <SubastasScreen onNavigate={navigate} isGuest={guest} />;
    case 'detalleSubasta':
      return <DetalleSubastaScreen onNavigate={navigate} params={params as ScreenParams['detalleSubasta']} isGuest={guest} />;
    case 'billetera':
      return <BilleteraScreen onNavigate={navigate} />;
    case 'ventas':
      return <VentasScreen onNavigate={navigate} />;
    case 'cuenta':
      return <CuentaScreen onNavigate={navigate} />;
    case 'ajustes':
      return <AjustesScreen onNavigate={navigate} />;
    case 'seguros':
      return <SegurosScreen onNavigate={navigate} />;
    case 'misProductos':
      return <MisProductosScreen onNavigate={navigate} params={params as ScreenParams['misProductos']} />;
    case 'inspeccion':
      return <InspeccionScreen onNavigate={navigate} params={params as ScreenParams['inspeccion']} />;
    case 'detalleAdjudicacion':
      return <DetalleAdjudicacionScreen onNavigate={navigate} />;
    case 'finalizarCompra':
      return <FinalizarCompraScreen onNavigate={navigate} params={params as ScreenParams['finalizarCompra']} />;
    case 'pagoExitoso':
      return <PagoExitosoScreen onNavigate={navigate} params={params as ScreenParams['pagoExitoso']} />;
    case 'pagoFallido':
      return <PagoFallidoScreen onNavigate={navigate} params={params as ScreenParams['pagoFallido']} />;
    case 'chatSoporte':
      return <ChatSoporteScreen onNavigate={navigate} params={params as ScreenParams['chatSoporte']} />;
    case 'publicarArticulo':
      return <PublicarArticuloScreen onNavigate={navigate} />;
    case 'agregarMetodoPago':
      return <AgregarMetodoPagoScreen onNavigate={navigate} />;
    case 'agregarTarjeta':
      return <AgregarTarjetaScreen onNavigate={navigate} />;
    case 'agregarCuentaBancaria':
      return <AgregarCuentaBancariaScreen onNavigate={navigate} />;
    case 'verificarCheque':
      return <VerificarChequeScreen onNavigate={navigate} />;
    case 'faltaMetodoPago':
      return <FaltaMetodoPagoScreen onNavigate={navigate} />;
    case 'accesoPlatino':
      return <AccesoPlatinoScreen onNavigate={navigate} />;
    case 'usuarioHabilitado':
      return <UsuarioHabilitadoScreen onNavigate={navigate} />;
    case 'cuentasCobro':
      return <CuentasCobroScreen onNavigate={navigate} />;
    case 'adminChats':
      return <AdminChatsScreen onNavigate={navigate} />;
    case 'crearSubasta':
      return <CrearSubastaScreen onNavigate={navigate} />;
    default:
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Screen not found</Text>
        </View>
      );
  }
}
