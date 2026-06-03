import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { AppHeader, BottomNav, StatusBadge, GavelIcon } from '../components';
import { usePagos } from '../hooks';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface VentasScreenProps {
  onNavigate: NavigateFn;
}

const FILTERS = ['Todos', 'PENDIENTE', 'PAGADO', 'VENCIDO'];

export function VentasScreen({ onNavigate }: VentasScreenProps) {
  const [filter, setFilter] = useState('Todos');
  const { pagos, loading } = usePagos();

  const filtered = filter === 'Todos' ? pagos : pagos.filter((p) => p.estadoPago === filter);
  const totalMonto = pagos.reduce((s, p) => s + (p.montoOfertado ?? 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Historial de ofertas" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>OFERTAS TOTALES</Text>
              <Text style={styles.statValue}>{pagos.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DINERO EN SUBASTAS ACTIVAS</Text>
              <Text style={[styles.statValue, { color: Colors.green }]}>$ {totalMonto.toLocaleString()}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, filter === f && styles.chipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />}

          {!loading && filtered.length === 0 && (
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32 }]}>No hay registros.</Text>
          )}

          {filtered.map((item) => {
            const statusColor = item.estadoPago === 'PAGADO' ? Colors.green : item.estadoPago === 'VENCIDO' ? Colors.red : Colors.orange;
            const statusBg = item.estadoPago === 'PAGADO' ? Colors.greenLight : item.estadoPago === 'VENCIDO' ? Colors.redLight : Colors.orangeLight;
            return (
              <View key={item.registroSubastaId} style={styles.offerCard}>
                <View style={[styles.offerImage, { backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' }]}>
                  <GavelIcon size={32} color={Colors.primary} strokeWidth={1.7} />
                </View>
                <View style={styles.offerBody}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={styles.offerTitle}>Subasta #{item.registroSubastaId}</Text>
                    <StatusBadge text={item.estadoPago} color={statusColor} bg={statusBg} />
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 8, gap: 24 }}>
                    <View>
                      <Text style={styles.offerLabel}>MONTO OFERTADO</Text>
                      <Text style={styles.offerValue}>${item.montoOfertado?.toLocaleString()}</Text>
                    </View>
                    {item.montoMulta > 0 && (
                      <View>
                        <Text style={styles.offerLabel}>MULTA</Text>
                        <Text style={[styles.offerValue, { color: Colors.red }]}>${item.montoMulta?.toLocaleString()}</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>Vence: {item.fechaVencimiento ?? '—'}</Text>
                    {item.bloqueado && (
                      <Text style={{ color: Colors.red, fontSize: 12, marginTop: 2, fontWeight: '700' }}>Cuenta bloqueada</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <BottomNav active="ventas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  statLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.dark },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: Colors.gray4, marginRight: 10 },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { color: Colors.gray, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  empty: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  offerCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 20, padding: 12, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  offerImage: { width: 80, height: 80, borderRadius: 14 },
  offerBody: { flex: 1, marginLeft: 14 },
  offerTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, flex: 1, marginRight: 8 },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  offerValue: { fontSize: 16, fontWeight: 'bold', color: Colors.dark },
});
