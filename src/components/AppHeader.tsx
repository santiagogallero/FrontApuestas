import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { Logo } from './Logo';
import { Colors } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function AppHeader({ title, onBack, right }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.side}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side}>
          <Logo size={28} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (RNStatusBar.currentHeight || 0) + 12,
    paddingBottom: 12,
    backgroundColor: Colors.bg,
  },
  side: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 24,
    color: Colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
});
