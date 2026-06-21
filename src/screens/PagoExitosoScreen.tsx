import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, AppButton, CheckIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface PagoExitosoScreenProps {
  onNavigate: NavigateFn;
  params: ScreenParams['pagoExitoso'];
}

export function PagoExitosoScreen({ onNavigate, params }: PagoExitosoScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Estado de transaccion" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center' }]}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.greenLight, marginBottom: 20 }]}>
            <View style={styles.checkInner}>
              <CheckIcon size={26} color={Colors.white} />
            </View>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Pago exitoso</Text>
          <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 12, letterSpacing: 1 }]}>
            ID DE TRANSACCIÓN: {params.transaccionId}
          </Text>

          <View style={[styles.badge, { backgroundColor: Colors.blueLight, marginTop: 16 }]}>
            <Text style={[styles.badgeText, { color: Colors.primary }]}>PAGO CONFIRMADO</Text>
          </View>

          <Text style={[styles.screenTitle, { marginTop: 24, textAlign: 'center', fontSize: 22 }]}>
            {params.productoDescripcion ?? `Adjudicación #${params.registroId}`}
          </Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            Medio: {params.medioPagoAlias}
          </Text>

          <View style={[styles.statsRow, { width: '100%', marginTop: 24 }]}>
            <View>
              <Text style={styles.offerLabel}>TOTAL PAGADO</Text>
              <Text style={[styles.bidPrice, { fontSize: 28 }]}>
                ${params.montoPagado.toLocaleString()} {params.moneda}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 32 }}>
        <AppButton title="Volver a subastas" onPress={() => onNavigate('subastas')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  iconCircle: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  checkInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
});
