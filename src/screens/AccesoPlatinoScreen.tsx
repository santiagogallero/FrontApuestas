import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, AppButton, BottomNav, LockBigIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

export function AccesoPlatinoScreen({ onNavigate }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Subastas" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.lockCircle}>
            <LockBigIcon size={56} color={Colors.orange} />
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>CATEGORÍA INSUFICIENTE</Text>
          </View>

          <Text style={styles.title}>Acceso Platino{'\n'}Requerido.</Text>
          <Text style={styles.desc}>
            Actualmente eres miembro Oro. El acceso a esta subasta exclusiva está limitado a participantes Platino verificados.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <AppButton title="Ver otras subastas" variant="outline" onPress={() => onNavigate('subastas')} />
      </View>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { paddingHorizontal: 24, paddingVertical: 20, alignItems: 'center' },
  lockCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    marginTop: 32, marginBottom: 24,
    shadowColor: Colors.orange, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 3,
  },
  badge: { backgroundColor: Colors.redLight, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginBottom: 24 },
  badgeText: { color: '#9F1239', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.dark, lineHeight: 40, textAlign: 'center', marginBottom: 20 },
  desc: { fontSize: 16, color: Colors.gray, lineHeight: 26, textAlign: 'center', paddingHorizontal: 8 },
  bottom: { paddingHorizontal: 24, paddingBottom: 8 },
});
