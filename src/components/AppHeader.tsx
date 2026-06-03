import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { Logo } from './Logo';
import { ArrowLeftIcon } from './icons';
import { Colors } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function AppHeader({ title, onBack, right }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={8} style={styles.backBtn}>
            <ArrowLeftIcon size={22} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <Logo size={26} />
        )}
        <Text style={[styles.title, onBack && styles.titleBack]}>{title}</Text>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: (RNStatusBar.currentHeight || 0) + 12,
    paddingBottom: 12,
    backgroundColor: Colors.bg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 10,
  },
  titleBack: {
    fontSize: 18,
    marginLeft: 6,
  },
  right: {
    marginLeft: 12,
  },
});
