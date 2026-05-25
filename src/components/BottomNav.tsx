import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '../theme/colors';
import type { ScreenName } from '../types/navigation';

interface BottomNavProps {
  active: ScreenName;
  onNavigate: (s: ScreenName) => void;
}

const tabs: { key: ScreenName; label: string; icon: string }[] = [
  { key: 'subastas', label: 'Subastas', icon: '🔨' },
  { key: 'ventas', label: 'Ventas', icon: '📈' },
  { key: 'billetera', label: 'Billetera', icon: '💳' },
  { key: 'cuenta', label: 'Cuenta', icon: '👤' },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.nav}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <TouchableOpacity key={t.key} style={styles.item} onPress={() => onNavigate(t.key)}>
            <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>{t.icon}</Text>
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
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    backgroundColor: Colors.blueLight,
  },
  icon: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
