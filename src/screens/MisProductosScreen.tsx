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
import { AppHeader, BottomNav, StatusBadge } from '../components';
import { useProductos } from '../hooks';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface MisProductosScreenProps {
  onNavigate: NavigateFn;
}

const FILTERS = ['Todos', 'Disponibles', 'No disponibles'];

export function MisProductosScreen({ onNavigate }: MisProductosScreenProps) {
  const [filter, setFilter] = useState('Todos');
  const { productos, loading } = useProductos();

  const filtered = filter === 'Todos'
    ? productos
    : productos.filter((p) => filter === 'Disponibles' ? p.disponible : !p.disponible);

  const vendidos = productos.filter((p) => !p.disponible).length;
  const pendientes = productos.filter((p) => p.disponible).length;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Mis productos" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MIS PRODUCTOS</Text>
              <Text style={styles.statValue}>{productos.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>VENDIDOS</Text>
              <Text style={[styles.statValue, { color: Colors.green }]}>{vendidos}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DISPONIBLES</Text>
              <Text style={styles.statValue}>{pendientes}</Text>
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
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32 }]}>No hay productos.</Text>
          )}

          {filtered.map((item) => {
            const statusColor = item.disponible ? Colors.primary : Colors.green;
            const statusBg = item.disponible ? Colors.blueLight : Colors.greenLight;
            const statusLabel = item.disponible ? 'DISPONIBLE' : 'VENDIDO';
            return (
              <View key={item.id} style={styles.offerCard}>
                <View style={[styles.offerImage, { backgroundColor: Colors.gray4, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 28 }}>📦</Text>
                </View>
                <View style={styles.offerBody}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={styles.offerTitle}>{item.descripcionCatalogo || `Producto #${item.id}`}</Text>
                    <StatusBadge text={statusLabel} color={statusColor} bg={statusBg} />
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>Fecha: {item.fecha}</Text>
                    {item.descripcionCompleta ? (
                      <Text style={{ color: Colors.gray2, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{item.descripcionCompleta}</Text>
                    ) : null}
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
});
