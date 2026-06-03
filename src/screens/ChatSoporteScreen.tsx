import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView, StyleSheet } from 'react-native';
import { AppHeader, PlusIcon, MicIcon, SendIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface ChatSoporteScreenProps {
  onNavigate: NavigateFn;
}

export function ChatSoporteScreen({ onNavigate }: ChatSoporteScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Soporte"
        onBack={() => onNavigate('misProductos')}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </View>
        }
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 }}>
        <View style={styles.statusDot} />
        <Text style={{ color: Colors.gray, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>UNIDAD DE AUTENTICACIÓN</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=200&h=150&fit=crop' }}
              style={{ width: 120, height: 90, borderRadius: 12 }}
            />
            <Text style={[styles.screenTitle, { marginTop: 12, textAlign: 'center' }]}>Toyota Corolla 2020</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Patente AAA000 | 235.000 km</Text>
            <View style={[styles.badge, { backgroundColor: Colors.redLight, marginTop: 8 }]}>
              <Text style={[styles.badgeText, { color: Colors.red }]}>INSPECCIÓN RECHAZADA</Text>
            </View>
          </View>

          <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>SENTINEL OFFICIAL   10:42 AM</Text>
          <View style={[styles.chatBubble, { alignSelf: 'flex-start', backgroundColor: Colors.gray4 }]}>
            <Text style={{ color: Colors.dark, fontSize: 14, lineHeight: 20 }}>
              Hola. Su inspeccion inicial fue rechazada. Necesitamos una foto de alta resolución de los papeles del vehículo para verificar su autenticidad
            </Text>
          </View>

          <View style={[styles.chatBubble, { alignSelf: 'flex-end', backgroundColor: Colors.primary }]}>
            <Text style={{ color: Colors.white, fontSize: 14, lineHeight: 20 }}>
              Hola. Te envío una imagen de los papeles del vehículo
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={[styles.badge, { backgroundColor: Colors.gray4 }]}>
              <Text style={[styles.badgeText, { color: Colors.gray }]}>●●●</Text>
            </View>
            <Text style={{ color: Colors.gray, fontSize: 12, marginLeft: 8 }}>EL EXPERTO ESTÁ ESCRIBIENDO...</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.chatInputBar}>
        <TouchableOpacity style={[styles.chatInputBtn, { width: 40 }]}>
          <PlusIcon size={22} color={Colors.gray} />
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder="Escribe tu mensaje aquí..."
          placeholderTextColor={Colors.gray2}
        />
        <TouchableOpacity style={[styles.chatInputBtn, { width: 40 }]}>
          <MicIcon size={20} color={Colors.gray2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatSendBtn}>
          <SendIcon size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green, marginRight: 8 },
  chatBubble: { maxWidth: '80%', borderRadius: 18, padding: 14, marginBottom: 10 },
  chatInputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 12 },
  chatInput: { flex: 1, height: 44, backgroundColor: Colors.gray4, borderRadius: 22, paddingHorizontal: 16, fontSize: 15, color: Colors.dark, marginHorizontal: 8 },
  chatInputBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  chatSendBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
