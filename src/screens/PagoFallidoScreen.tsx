import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, AppButton, AlertCircleIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface PagoFallidoScreenProps {
  onNavigate: NavigateFn;
  params: ScreenParams['pagoFallido'];
}

export function PagoFallidoScreen({ onNavigate, params }: PagoFallidoScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Estado de transaccion" onBack={() => onNavigate('finalizarCompra', { registroId: params.registroId })} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center' }]}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.redLight, marginBottom: 20 }]}>
            <AlertCircleIcon size={40} color={Colors.red} />
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Transacción fallida</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            {params.mensaje ??
              'Su pago fue rechazado. Verificá que el método esté activo y tenga fondos suficientes.'}
          </Text>

          <View style={[styles.warningCard, { marginTop: 24, width: '100%' }]}>
            <Text style={[styles.sectionTitle, { color: Colors.red, marginBottom: 8 }]}>Política de pago</Text>
            <Text style={{ color: Colors.red, fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
              Si no se realiza el pago dentro de las 72 horas, se aplicará una penalización del 10% sobre el monto ofertado.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
              <Text style={{ color: Colors.red, fontSize: 24, fontWeight: 'bold' }}>
                ${params.multaPotencial.toLocaleString()}
              </Text>
              <Text style={{ color: Colors.red, fontSize: 14, marginLeft: 8, opacity: 0.8 }}>
                (10% · {params.moneda})
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 32 }}>
        <AppButton
          title="Utilizar otro método de pago"
          variant="secondary"
          onPress={() => onNavigate('finalizarCompra', { registroId: params.registroId })}
        />
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
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  warningCard: {
    backgroundColor: Colors.redLight,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
});
