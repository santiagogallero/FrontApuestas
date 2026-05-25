import React from 'react';
import { View, Text, ScrollView, Image, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface PagoExitosoScreenProps {
  onNavigate: NavigateFn;
}

export function PagoExitosoScreen({ onNavigate }: PagoExitosoScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Estado de transaccion" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center' }]}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.greenLight, marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>✅</Text>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Pago exitoso</Text>
          <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 12, letterSpacing: 1 }]}>
            ID DE TRANSACCIÓN: TXN-8829-4401-RTB
          </Text>

          <View style={[styles.badge, { backgroundColor: Colors.blueLight, marginTop: 16 }]}>
            <Text style={[styles.badgeText, { color: Colors.primary }]}>LOTE VERIFICADO</Text>
          </View>

          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=350&fit=crop' }}
            style={[styles.detailImage, { marginTop: 20 }]}
          />

          <Text style={[styles.screenTitle, { marginTop: 20, textAlign: 'center' }]}>Centinela de Plata Cronógrafo</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>Serial #2993-A | Limited Edition{'\n'}Sentinel Series</Text>

          <View style={[styles.statsRow, { width: '100%', marginTop: 24 }]}>
            <View>
              <Text style={styles.offerLabel}>TOTAL PAID</Text>
              <Text style={[styles.bidPrice, { fontSize: 28 }]}>$1,880.00</Text>
            </View>
            <TouchableOpacity style={[styles.chip, { borderWidth: 1, borderColor: Colors.gray3 }]}>
              <Text style={styles.chipText}>⬇️ Descargar Recibo</Text>
            </TouchableOpacity>
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
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  detailImage: { width: '100%', height: 260, borderRadius: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: Colors.gray4 },
  chipText: { color: Colors.gray, fontSize: 14, fontWeight: '500' },
});
