import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { AppHeader, AppButton, Toggle, BellIcon, GlobeIcon, LockIcon, DollarIcon, MoonIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface AjustesScreenProps {
  onNavigate: NavigateFn;
}

type IconCmp = (p: { size?: number; color?: string }) => React.ReactElement;

export function AjustesScreen({ onNavigate }: AjustesScreenProps) {
  const [settings, setSettings] = useState({
    notificaciones: true,
    idioma: false,
    biometrico: true,
    moneda: false,
    modoOscuro: false,
  });

  const items: { key: string; label: string; Icon: IconCmp }[] = [
    { key: 'notificaciones', label: 'Notificaciones', Icon: BellIcon },
    { key: 'idioma', label: 'Idioma: Español', Icon: GlobeIcon },
    { key: 'biometrico', label: 'Autenticación biométrica', Icon: LockIcon },
    { key: 'moneda', label: 'Moneda: USD', Icon: DollarIcon },
    { key: 'modoOscuro', label: 'Modo oscuro', Icon: MoonIcon },
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
                <item.Icon size={20} color={Colors.primary} />
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
