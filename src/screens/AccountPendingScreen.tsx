import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppButton, Logo } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface AccountPendingScreenProps {
  onNavigate: NavigateFn;
}

export function AccountPendingScreen({ onNavigate }: AccountPendingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACCESO EN REVISION</Text>
        </View>
        <Text style={styles.title}>Cuenta en{'\n'}verificación</Text>
        <View style={styles.row}>
          <Logo size={20} color={Colors.orange} strokeWidth={2.4} />
          <Text style={styles.desc}>
            Su cuenta esta siendo verificada en aproximadamente tarda 24hs.
          </Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <AppButton title="Iniciar sesión" variant="secondary" onPress={() => onNavigate('login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  center: { flex: 1, justifyContent: 'flex-start', paddingTop: 96, paddingHorizontal: 32 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.orange,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 24,
    lineHeight: 48,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
  },
  desc: {
    color: Colors.gray3,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  bottom: { padding: 20, paddingBottom: 40 },
});
