import React from 'react';
import { View, Text, ScrollView, Image, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, ShieldIcon, ReceiptIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface DetalleAdjudicacionScreenProps {
  onNavigate: NavigateFn;
}

export function DetalleAdjudicacionScreen({ onNavigate }: DetalleAdjudicacionScreenProps) {
  const status = 'PAGO APROBADO';
  const statusColor = Colors.green;
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Historial de ofertas" onBack={() => onNavigate('ventas')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Detalle de adjudicación</Text>
          <Text style={[styles.subtitle, { marginBottom: 20 }]}>La validación técnica del activo ha finalizado.</Text>

          <View style={styles.adjCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.adjLabel}>STATUS ACTUAL</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.adjStatus, { color: statusColor }]}>{status}</Text>
                </View>
              </View>
              <View style={[styles.badge, styles.certBadge]}>
                <ShieldIcon size={12} color={Colors.primary} />
                <Text style={[styles.badgeText, { color: Colors.primary, marginLeft: 5 }]}>Sentinel Certified</Text>
              </View>
            </View>

            <View style={styles.adjImageWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop' }}
                style={styles.adjImage}
              />
              <Text style={styles.adjImageLabel}>Patek AAA000</Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.offerLabel}>PRECIO FINAL</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.bidPrice}>$30,000</Text>
              <Text style={{ color: Colors.gray, fontSize: 16, marginLeft: 6 }}>USD</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.gray3 }}>
            <Text style={{ color: Colors.gray, fontSize: 16, flex: 1 }}>Gestionaremos la entrega por correo electrónico.</Text>
            <ReceiptIcon size={20} color={Colors.gray} />
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
  adjCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  adjLabel: { fontSize: 11, color: Colors.gray, fontWeight: '700', letterSpacing: 1 },
  adjStatus: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  adjImageWrap: { marginTop: 16, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  adjImage: { width: '100%', height: 200 },
  adjImageLabel: { position: 'absolute', bottom: 12, left: 12, color: Colors.white, fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  certBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blueLight },
  badgeText: { fontSize: 11, fontWeight: '700' },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
});
