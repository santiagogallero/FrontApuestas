import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  VerifyEmailScreen,
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
  DetalleAdjudicacionScreen,
  FinalizarCompraScreen,
  PagoExitosoScreen,
  PagoFallidoScreen,
  ChatSoporteScreen,
} from '../screens';
import type { ScreenName, ScreenParams, NavState, NavigateFn } from '../types/navigation';

export function Navigator() {
  const [nav, setNav] = useState<NavState>({ screen: 'splash' });
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (nav.screen === 'splash') {
      setNav({ screen: 'login' });
    }
  }, [isLoading, nav.screen]);

  const navigate: NavigateFn = (screen, params) => {
    setNav({ screen, params } as NavState);
  };

  const { screen, params } = nav;

  switch (screen) {
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <LoginScreen onNavigate={navigate} />;
    case 'register':
      return <RegisterScreen onNavigate={navigate} />;
    case 'verifyEmail':
      return <VerifyEmailScreen onNavigate={navigate} params={params as ScreenParams['verifyEmail']} />;
    case 'accountPending':
      return <AccountPendingScreen onNavigate={navigate} />;
    case 'recuperarCuenta':
      return <RecuperarCuentaScreen onNavigate={navigate} />;
    case 'subastas':
      return <SubastasScreen onNavigate={navigate} />;
    case 'detalleSubasta':
      return <DetalleSubastaScreen onNavigate={navigate} params={params as ScreenParams['detalleSubasta']} />;
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
      return <MisProductosScreen onNavigate={navigate} />;
    case 'detalleAdjudicacion':
      return <DetalleAdjudicacionScreen onNavigate={navigate} />;
    case 'finalizarCompra':
      return <FinalizarCompraScreen onNavigate={navigate} />;
    case 'pagoExitoso':
      return <PagoExitosoScreen onNavigate={navigate} />;
    case 'pagoFallido':
      return <PagoFallidoScreen onNavigate={navigate} />;
    case 'chatSoporte':
      return <ChatSoporteScreen onNavigate={navigate} />;
    default:
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Screen not found</Text>
        </View>
      );
  }
}
