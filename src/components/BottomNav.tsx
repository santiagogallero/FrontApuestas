import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GavelIcon, TrendingIcon, WalletIcon, UserIcon } from './icons';
import { Colors } from '../theme/colors';
import type { ScreenName } from '../types/navigation';

interface BottomNavProps {
  active: ScreenName;
  onNavigate: (s: ScreenName) => void;
  isGuest?: boolean;
}

type IconCmp = (p: { size?: number; color?: string }) => React.ReactElement;

const tabs: { key: ScreenName; label: string; Icon: IconCmp; requiresAuth: boolean }[] = [
  { key: 'subastas', label: 'Subastas', Icon: GavelIcon, requiresAuth: false },
  { key: 'ventas', label: 'Ventas', Icon: TrendingIcon, requiresAuth: true },
  { key: 'billetera', label: 'Billetera', Icon: WalletIcon, requiresAuth: true },
  { key: 'cuenta', label: 'Cuenta', Icon: UserIcon, requiresAuth: true },
];

export function BottomNav({ active, onNavigate, isGuest }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      {tabs.map((t) => {
        const locked = isGuest && t.requiresAuth;
        const isActive = active === t.key;
        const color = locked ? Colors.gray3 : isActive ? Colors.primary : Colors.gray2;
        return (
          <TouchableOpacity key={t.key} style={styles.item} onPress={() => onNavigate(t.key)} activeOpacity={0.7}>
            <View style={[styles.iconBox, isActive && !locked && styles.iconBoxActive]}>
              <t.Icon size={22} color={color} />
              {locked && <Text style={styles.lock}>🔒</Text>}
            </View>
            <Text style={[styles.label, isActive && !locked && styles.labelActive, locked && styles.labelLocked]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    backgroundColor: Colors.blueLight,
  },
  label: {
    fontSize: 11,
    color: Colors.gray2,
    marginTop: 3,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  labelLocked: {
    color: Colors.gray3,
  },
  lock: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 10,
  },
});
