import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, BottomNav, CheckIcon, BankIcon, CreditCardIcon, CheckCircleIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

const metodos = [
  { Icon: BankIcon, title: 'Corporate Wire', sub: 'Swift Ref: ****8922' },
  { Icon: CreditCardIcon, title: 'Visa Premium', sub: 'Finaliza en 4001' },
];

export function UsuarioHabilitadoScreen({ onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => onNavigate('billetera')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.checkWrap}>
            <View style={styles.checkCircle}>
              <CheckIcon size={30} color={Colors.white} />
            </View>
            <View style={styles.checkRing} />
          </View>

          <Text style={styles.title}>Usuario habilitado{'\n'}para participar</Text>
          <Text style={styles.desc}>
            Su perfil financiero ha sido verificado. Ahora tiene acceso total al mercado en tiempo real.
          </Text>

          <View style={styles.card}>
            <Text style={styles.nodeRef}>VERIFIED_NODE_29</Text>
            <Text style={styles.sectionLabel}>ESTADO DE LA CUENTA</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Usuario habilitado</Text>
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MÉTODOS DE PAGO ACTIVOS</Text>
            {metodos.map((m, i) => (
              <View key={i} style={styles.metodo}>
                <View style={styles.metodoIcon}>
                  <m.Icon size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metodoTitle}>{m.title}</Text>
                  <Text style={styles.metodoSub}>{m.sub}</Text>
                </View>
                <CheckCircleIcon size={18} color={Colors.green} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav active="billetera" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center' },
  checkWrap: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 20 },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6EE7A8', justifyContent: 'center', alignItems: 'center' },
  checkRing: { position: 'absolute', top: 0, right: 8, width: 16, height: 16, borderRadius: 8, borderWidth: 4, borderColor: Colors.primary },
  title: { fontSize: 30, fontWeight: '900', color: Colors.dark, textAlign: 'center', lineHeight: 36 },
  desc: { fontSize: 15, color: Colors.gray, textAlign: 'center', lineHeight: 22, marginTop: 10, paddingHorizontal: 12 },
  card: { width: '100%', backgroundColor: Colors.blueLight, borderRadius: 20, padding: 20, marginTop: 28 },
  nodeRef: { alignSelf: 'flex-end', color: Colors.gray2, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray, letterSpacing: 0.8, marginTop: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green, marginRight: 10 },
  statusText: { fontSize: 18, fontWeight: '800', color: Colors.dark },
  metodo: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginTop: 12,
  },
  metodoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  metodoTitle: { fontSize: 15, fontWeight: '800', color: Colors.dark },
  metodoSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
});
