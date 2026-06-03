import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { AppHeader, BottomNav, GavelIcon, CalendarIcon, MapPinIcon } from '../components';
import { useAuthContext } from '../context/AuthContext';
import { useSubastas } from '../hooks';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface SubastasScreenProps {
  onNavigate: NavigateFn;
}

const FILTERS = ['Todas', 'Común', 'Plata', 'Oro', 'Platino'];

export function SubastasScreen({ onNavigate }: SubastasScreenProps) {
  const { currentUser } = useAuthContext();
  const { filtered, loading, filter, setFilter } = useSubastas();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Subastas"
        right={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentUser?.email?.slice(0, 2).toUpperCase() ?? 'AS'}</Text>
          </View>
        }
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>Subastas disponibles</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
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
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32 }]}>No hay subastas disponibles.</Text>
          )}

          {filtered.map((item) => {
            const isLive = item.estado === 'ACTIVA' || item.estado === 'EN_CURSO';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => onNavigate('detalleSubasta', { subasta: item })}
                activeOpacity={0.9}
              >
                <View style={styles.imageWrap}>
                  <View style={[styles.image, { backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' }]}>
                    <GavelIcon size={56} color={Colors.primary} strokeWidth={1.6} />
                  </View>
                  <View style={styles.badges}>
                    <View style={[styles.badge, isLive ? styles.badgeLive : styles.badgeUpcoming]}>
                      <Text style={[styles.badgeText, isLive ? styles.badgeLiveText : styles.badgeUpcomingText]}>
                        {isLive ? '● LIVE' : item.estado ?? 'PENDIENTE'}
                      </Text>
                    </View>
                    <View style={styles.badgeCategory}>
                      <Text style={styles.badgeCategoryText}>CATEGORÍA {(item.categoria ?? '—').toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.body}>
                  <Text style={styles.cardTitle}>Subasta #{item.id}</Text>
                  <View style={styles.meta}>
                    <CalendarIcon size={14} color={Colors.gray} />
                    <Text style={styles.metaText}>{item.fecha} {item.hora}</Text>
                  </View>
                  {item.ubicacion ? (
                    <View style={styles.meta}>
                      <MapPinIcon size={14} color={Colors.gray} />
                      <Text style={styles.metaText}>{item.ubicacion}</Text>
                    </View>
                  ) : null}
                  <View style={styles.footer}>
                    <View />
                    <TouchableOpacity style={styles.button} onPress={() => onNavigate('detalleSubasta', { subasta: item })}>
                      <Text style={styles.buttonText}>{isLive ? 'Ingresar a la subasta' : 'Ver detalles'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  empty: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  chip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: Colors.gray4, marginRight: 10,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { color: Colors.gray, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', height: 200 },
  image: { width: '100%', height: 200 },
  badges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeLive: { backgroundColor: Colors.red },
  badgeUpcoming: { backgroundColor: Colors.primary },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeLiveText: { color: Colors.white },
  badgeUpcomingText: { color: Colors.white },
  badgeCategory: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeCategoryText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  body: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  meta: { marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  metaText: { color: Colors.gray, fontSize: 13, marginLeft: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  buttonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
});
