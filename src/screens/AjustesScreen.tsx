import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { AppHeader, AppButton, Toggle } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface AjustesScreenProps {
  onNavigate: NavigateFn;
}

export function AjustesScreen({ onNavigate }: AjustesScreenProps) {
  const [settings, setSettings] = useState({
    notificaciones: true,
    idioma: false,
    biometrico: true,
    moneda: false,
    modoOscuro: false,
  });

  const items = [
    { key: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
    { key: 'idioma', label: 'Idioma: Español', icon: '🌐' },
    { key: 'biometrico', label: 'Autenticación biométrica', icon: '🔐' },
    { key: 'moneda', label: 'Moneda: USD', icon: '$' },
    { key: 'modoOscuro', label: 'Modo oscuro', icon: '🌙' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Ajustes" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Preferencias de la cuenta</Text>
          {items.map((item) => (
            <View key={item.key} style={styles.settingRow}>
              <View style={styles.menuIconBox}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Toggle
                value={settings[item.key as keyof typeof settings]}
                onValueChange={(v) => setSettings((s) => ({ ...s, [item.key]: v }))}
              />
            </View>
          ))}

          <AppButton title="Guardar cambios" onPress={() => Alert.alert('Guardado', 'Tus preferencias se han actualizado')} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.dark, marginLeft: 12 },
});
