import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import {
  AppHeader,
  AppButton,
  BottomNav,
  BankIcon,
  CreditCardIcon,
  CheckCircleIcon,
  InfoIcon,
  ChevronRightIcon,
} from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenName } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

type Option = {
  key: string;
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  screen: ScreenName;
};

const options: Option[] = [
  { key: 'banco', label: 'Cuenta de Banco', Icon: BankIcon, screen: 'agregarCuentaBancaria' },
  { key: 'tarjeta', label: 'Tarjeta de Credito/Debito', Icon: CreditCardIcon, screen: 'agregarTarjeta' },
  { key: 'cheque', label: 'Cheque Certificado', Icon: CheckCircleIcon, screen: 'verificarCheque' },
];

export function AgregarMetodoPagoScreen({ onNavigate }: Props) {
  const [selected, setSelected] = useState('banco');

  const goSelected = () => {
    const opt = options.find((o) => o.key === selected);
    if (opt) onNavigate(opt.screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => onNavigate('billetera')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>CUMPLIMIENTO Y SEGURIDAD</Text>
          <Text style={styles.title}>Agregar método de pago</Text>

          <View style={styles.infoCard}>
            <InfoIcon size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Es requerido al menos un modo de pago verificado.</Text>
          </View>

          <View style={{ marginTop: 24 }}>
            {options.map((opt) => {
              const active = selected === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => setSelected(opt.key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionIcon}>
                    <opt.Icon size={22} color={Colors.primary} />
                  </View>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  <ChevronRightIcon size={20} color={active ? Colors.primary : Colors.gray2} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.protocolCard}>
            <Text style={styles.protocolTitle}>PROTOCOL INSIGHT</Text>
            <Text style={styles.protocolText}>
              Para mantener la integridad de la subasta, todos los métodos registrados se someten a un protocolo de verificación de fondos. Es posible que se aplique una pequeña retención temporal para confirmar la liquidez.
            </Text>
          </View>

          <AppButton title="Verificar método" icon="→" onPress={goSelected} />
        </View>
      </ScrollView>
      <BottomNav active="billetera" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  eyebrow: { fontSize: 12, fontWeight: '800', color: Colors.gray, letterSpacing: 1.2, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '900', color: Colors.dark, marginBottom: 20 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blueLight, borderRadius: 14,
    padding: 16, borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  infoText: { flex: 1, marginLeft: 12, color: Colors.dark, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  optionActive: { borderColor: Colors.primary, backgroundColor: Colors.blueLight },
  optionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.dark, marginLeft: 14 },
  protocolCard: { backgroundColor: Colors.blueLight, borderRadius: 16, padding: 18, marginTop: 12, marginBottom: 8 },
  protocolTitle: { fontSize: 12, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: 8 },
  protocolText: { color: Colors.gray, fontSize: 13, lineHeight: 20 },
});
