import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GavelIcon, TrendingIcon, WalletIcon, UserIcon } from './icons';
import { Colors } from '../theme/colors';
import type { ScreenName } from '../types/navigation';

interface BottomNavProps {
  active: ScreenName;
  onNavigate: (s: ScreenName) => void;
}

type IconCmp = (p: { size?: number; color?: string }) => React.ReactElement;

const tabs: { key: ScreenName; label: string; Icon: IconCmp }[] = [
  { key: 'subastas', label: 'Subastas', Icon: GavelIcon },
  { key: 'ventas', label: 'Ventas', Icon: TrendingIcon },
  { key: 'billetera', label: 'Billetera', Icon: WalletIcon },
  { key: 'cuenta', label: 'Cuenta', Icon: UserIcon },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        const color = isActive ? Colors.primary : Colors.gray2;
        return (
          <TouchableOpacity key={t.key} style={styles.item} onPress={() => onNavigate(t.key)} activeOpacity={0.7}>
            <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
              <t.Icon size={22} color={color} />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
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
});
