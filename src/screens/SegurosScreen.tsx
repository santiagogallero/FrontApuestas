import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface SegurosScreenProps {
  onNavigate: NavigateFn;
}

export function SegurosScreen({ onNavigate }: SegurosScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Seguros y Seguridad" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { alignSelf: 'center', marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>🛡️</Text>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Tu confianza, asegurada</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            Cada operación realizada en la plataforma está respaldada por pólizas de aseguradoras certificadas a nivel internacional.
          </Text>

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <Text style={[styles.infoTitle, { fontSize: 18 }]}>¿Por qué trabajamos con seguros?</Text>
            <Text style={[styles.infoDesc, { marginTop: 8 }]}>
              Protegemos cada transacción para que compradores y vendedores operen sin miedo a pérdidas, fraudes o disputas. La seguridad no es opcional: es el corazón del servicio.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 16 }}>
              <Text style={{ color: Colors.primary, fontSize: 28, fontWeight: 'bold' }}>100%</Text>
              <Text style={{ color: Colors.gray, fontSize: 14, marginLeft: 8 }}>de las operaciones cubiertas</Text>
            </View>
          </View>
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
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  infoCard: { backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
