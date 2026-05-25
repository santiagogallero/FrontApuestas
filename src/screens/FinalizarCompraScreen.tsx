import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, AppButton } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface FinalizarCompraScreenProps {
  onNavigate: NavigateFn;
}

export function FinalizarCompraScreen({ onNavigate }: FinalizarCompraScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Finalizar Compra" onBack={() => onNavigate('detalleAdjudicacion')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Finalizar Compra</Text>
          <Text style={[styles.subtitle, { marginBottom: 20 }]}>Elige un método de pago</Text>

          <View style={[styles.paymentCard, { backgroundColor: Colors.primary }]}>
            <View style={styles.paymentIconBox}>
              <Text style={{ fontSize: 20 }}>💳</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: Colors.white }]}>Tarjeta Visa que termina en 4242</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#93C5FD', marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: '#93C5FD' }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentCard, { backgroundColor: Colors.gray4, marginTop: 12 }]}>
            <View style={[styles.paymentIconBox, { backgroundColor: Colors.white }]}>
              <Text style={{ fontSize: 20 }}>🏦</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: Colors.dark }]}>Cuenta bancaria de Chase que termina en 7856</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: Colors.gray, marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: Colors.gray }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentCard, { backgroundColor: Colors.gray4, marginTop: 12 }]}>
            <View style={[styles.paymentIconBox, { backgroundColor: Colors.white }]}>
              <Text style={{ fontSize: 20 }}>🧾</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: Colors.dark }]}>Recibo #100234</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: Colors.gray, marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: Colors.gray }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.warningCard, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: Colors.red, marginBottom: 8 }]}>Política de pago</Text>
            <Text style={{ color: Colors.red, fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
              Si no se realiza el pago dentro de las 72 horas, se aplicará una penalización del 10% sobre el monto ofertado.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
              <Text style={{ color: Colors.red, fontSize: 24, fontWeight: 'bold' }}>$150.00</Text>
              <Text style={{ color: Colors.red, fontSize: 14, marginLeft: 8, opacity: 0.8 }}>(10% del precio de remate)</Text>
            </View>
          </View>

          <AppButton title="Pagar" icon="🔒" onPress={() => onNavigate('pagoExitoso')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16 },
  paymentIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  paymentInfo: { flex: 1, marginLeft: 14 },
  paymentTitle: { fontSize: 15, fontWeight: '600' },
  paymentSub: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  warningCard: { backgroundColor: Colors.redLight, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: Colors.red },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
});
