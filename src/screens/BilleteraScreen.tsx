import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { AppHeader, AppButton, BottomNav } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface BilleteraScreenProps {
  onNavigate: NavigateFn;
}

export function BilleteraScreen({ onNavigate }: BilleteraScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Mi billetera" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Métodos de pago registrados</Text>

          {/* Nota: el backend no expone GET /api/auth/payment-methods; esto es mock hasta que se implemente */}
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

          <View style={[styles.balanceCard, { marginTop: 32 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Saldo disponible</Text>
            <Text style={{ color: Colors.gray, fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Fondos listos para tus próximas ofertas y compras en la plataforma.
            </Text>
            <Text style={styles.balanceAmount}>$12,480.00</Text>
          </View>

          <AppButton title="+ Agregar método de pago" icon="🔒" onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')} />
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16 },
  paymentIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  paymentInfo: { flex: 1, marginLeft: 14 },
  paymentTitle: { fontSize: 15, fontWeight: '600' },
  paymentSub: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  balanceCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
});
