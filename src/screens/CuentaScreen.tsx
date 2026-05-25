import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { BottomNav } from '../components';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenName } from '../types/navigation';

interface CuentaScreenProps {
  onNavigate: NavigateFn;
}

const menuItems: { icon: string; label: string; screen: ScreenName; badge?: string; badgeColor?: string; badgeBg?: string }[] = [
  { icon: '💳', label: 'Métodos de pago', screen: 'billetera', badge: '', badgeColor: Colors.green, badgeBg: Colors.greenLight },
  { icon: '📋', label: 'Historial de ofertas', screen: 'ventas' },
  { icon: '📦', label: 'Mis productos', screen: 'misProductos' },
  { icon: '🛡️', label: 'Seguros y Seguridad', screen: 'seguros' },
  { icon: '⚙️', label: 'Ajustes', screen: 'ajustes' },
];

export function CuentaScreen({ onNavigate }: CuentaScreenProps) {
  const { currentUser, onLogout } = useAuthContext();
  const initials = currentUser?.email?.slice(0, 2).toUpperCase() ?? '??';
  const roles = currentUser?.roles ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center', paddingTop: 20 }]}>
          <View style={styles.profileWrap}>
            <View style={[styles.profileAvatar, { backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: Colors.white, fontSize: 32, fontWeight: '700' }}>{initials}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={{ fontSize: 10 }}>✅</Text>
            </View>
          </View>
          <Text style={[styles.screenTitle, { marginTop: 12 }]}>{currentUser?.email ?? '—'}</Text>
          <View style={styles.categoryBadge}>
            <Text style={{ fontSize: 12, marginRight: 4 }}>🏷️</Text>
            <Text style={styles.categoryBadgeText}>{roles.join(', ') || currentUser?.estado || '—'}</Text>
          </View>

          <View style={{ width: '100%', marginTop: 8 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={() => onNavigate(item.screen)}>
                <View style={styles.menuIconBox}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge ? (
                  <View style={[styles.menuBadge, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.menuBadgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>⎋</Text>
            <Text style={styles.logoutText}>FINALIZAR LA SESIÓN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav active="cuenta" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  profileWrap: { position: 'relative' },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.primary },
  profileBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blueLight, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  categoryBadgeText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.dark, marginLeft: 12 },
  menuBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  menuBadgeText: { fontSize: 12, fontWeight: '600' },
  menuArrow: { fontSize: 20, color: Colors.gray2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 12 },
  logoutText: { color: Colors.red, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
});
