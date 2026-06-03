import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import {
  BottomNav,
  CreditCardIcon,
  ReceiptIcon,
  PackageIcon,
  ShieldIcon,
  SettingsIcon,
  ChevronRightIcon,
  LogOutIcon,
} from '../components';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenName } from '../types/navigation';

interface CuentaScreenProps {
  onNavigate: NavigateFn;
}

type MenuItem = {
  Icon: (p: { size?: number; color?: string }) => React.ReactElement;
  label: string;
  screen: ScreenName;
  badge?: string;
};

const menuItems: MenuItem[] = [
  { Icon: CreditCardIcon, label: 'Métodos de pago', screen: 'billetera', badge: '3 Verificado' },
  { Icon: ReceiptIcon, label: 'Historial de ofertas', screen: 'ventas' },
  { Icon: PackageIcon, label: 'Mis productos', screen: 'misProductos' },
  { Icon: ShieldIcon, label: 'Seguros y Seguridad', screen: 'seguros' },
  { Icon: SettingsIcon, label: 'Ajustes', screen: 'ajustes' },
];

export function CuentaScreen({ onNavigate }: CuentaScreenProps) {
  const { currentUser, onLogout } = useAuthContext();
  const initials = currentUser?.email?.slice(0, 2).toUpperCase() ?? '??';
  const roles = currentUser?.roles ?? [];
  const categoria = roles.join(', ') || currentUser?.estado || 'ORO';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Perfil */}
          <View style={styles.profileWrap}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>{initials}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={styles.profileCheck}>✓</Text>
            </View>
          </View>
          <Text style={styles.name}>{currentUser?.email ?? 'Usuario'}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>CATEGORÍA {categoria.toUpperCase()}</Text>
          </View>

          {/* Progreso de nivel */}
          <View style={styles.levelCard}>
            <Text style={styles.levelLabel}>PROGRESO DE NIVEL</Text>
            <View style={styles.levelRow}>
              <Text style={styles.levelNext}>Siguiente: PLATINO</Text>
              <Text style={styles.levelPct}>74%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '74%' }]} />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>SUBASTAS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: Colors.green }]}>12</Text>
              <Text style={styles.statLabel}>GANADO</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>$142k</Text>
              <Text style={styles.statLabel}>PAGADO</Text>
            </View>
          </View>

          {/* Menú */}
          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={() => onNavigate(item.screen)} activeOpacity={0.7}>
                <View style={styles.menuIconBox}>
                  <item.Icon size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <ChevronRightIcon size={20} color={Colors.gray2} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
            <LogOutIcon size={18} color={Colors.red} />
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
  content: { paddingHorizontal: 20, paddingVertical: 24, alignItems: 'center' },
  profileWrap: { position: 'relative' },
  profileAvatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary,
    borderWidth: 3, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  profileInitials: { color: Colors.white, fontSize: 32, fontWeight: '700' },
  profileBadge: {
    position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.bg,
  },
  profileCheck: { color: Colors.white, fontSize: 13, fontWeight: '900' },
  name: { fontSize: 28, fontWeight: '800', color: Colors.dark, marginTop: 14 },
  categoryBadge: { backgroundColor: Colors.blueLight, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginTop: 10 },
  categoryBadgeText: { color: Colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  levelCard: {
    width: '100%', backgroundColor: Colors.white, borderRadius: 18, padding: 18, marginTop: 22,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  levelLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray2, letterSpacing: 1 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  levelNext: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  levelPct: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: Colors.gray4, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statsRow: { flexDirection: 'row', width: '100%', marginTop: 14, gap: 10 },
  statBox: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.dark },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.gray2, letterSpacing: 0.8, marginTop: 4 },
  menu: { width: '100%', marginTop: 22 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  menuIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.dark, marginLeft: 14 },
  menuBadge: { backgroundColor: Colors.greenLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.green },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%',
    backgroundColor: Colors.redLight, borderRadius: 16, paddingVertical: 16, marginTop: 12,
  },
  logoutText: { color: Colors.red, fontSize: 14, fontWeight: '800', letterSpacing: 0.5, marginLeft: 8 },
});
