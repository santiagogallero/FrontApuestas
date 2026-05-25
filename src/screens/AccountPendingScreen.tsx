import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AppButton } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

const { width } = Dimensions.get('window');

interface AccountPendingScreenProps {
  onNavigate: NavigateFn;
}

export function AccountPendingScreen({ onNavigate }: AccountPendingScreenProps) {
  return (
    <View style={[styles.container, { backgroundColor: '#1e293b' }]}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACCESO EN REVISION</Text>
        </View>
        <Text style={[styles.title, { color: Colors.white, marginTop: 24 }]}>Cuenta en verificación</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, maxWidth: width * 0.7 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>⚡</Text>
          <Text style={{ color: Colors.gray3, fontSize: 16, lineHeight: 24 }}>
            Su cuenta esta siendo verificada en aproximadamente tarda 24hs.
          </Text>
        </View>
      </View>
      <View style={{ padding: 20, paddingBottom: 40 }}>
        <AppButton title="Iniciar sesión" variant="secondary" onPress={() => onNavigate('login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  badge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
});
