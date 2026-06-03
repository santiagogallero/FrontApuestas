import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, AppButton, BottomNav, LockBigIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

export function FaltaMetodoPagoScreen({ onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Subastas" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.illustration}>
            <View style={styles.illustrationCard}>
              <View style={styles.illLineShort} />
              <View style={styles.illLine} />
              <View style={styles.illLine} />
              <View style={styles.illDotsRow}>
                <View style={[styles.illDot, { backgroundColor: Colors.redLight }]} />
                <View style={[styles.illDot, { backgroundColor: Colors.blueLight }]} />
              </View>
            </View>
            <View style={styles.lockBadge}>
              <LockBigIcon size={36} color={Colors.white} />
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>PROTOCOLO DE SEGURIDAD REQUERIDO</Text>
          </View>

          <Text style={styles.title}>Falta{'\n'}Método de pago</Text>
          <Text style={styles.desc}>
            Para participar en las subastas en directo y mantener la integridad de nuestro ecosistema financiero de vigilancia, debe registrarse al menos un método de pago verificado.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <AppButton title="Agregar método de pago" icon="＋" onPress={() => onNavigate('agregarMetodoPago')} />
      </View>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { paddingHorizontal: 24, paddingVertical: 20 },
  illustration: { alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 28, position: 'relative' },
  illustrationCard: {
    width: 240, height: 180, borderRadius: 20, backgroundColor: Colors.blueLight, padding: 22, justifyContent: 'center',
  },
  illLineShort: { width: 60, height: 22, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.8)', marginBottom: 14 },
  illLine: { width: '85%', height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  illDotsRow: { flexDirection: 'row', marginTop: 8 },
  illDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  lockBadge: {
    position: 'absolute', right: 24, top: 4, width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  badge: { alignSelf: 'flex-start', backgroundColor: Colors.redLight, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, marginBottom: 16 },
  badgeText: { color: Colors.red, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: 36, fontWeight: '900', color: Colors.dark, lineHeight: 42, marginBottom: 16 },
  desc: { fontSize: 16, color: Colors.gray, lineHeight: 26 },
  bottom: { paddingHorizontal: 24, paddingBottom: 8 },
});
