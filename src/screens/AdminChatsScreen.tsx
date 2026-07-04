import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { BottomNav, ChatIcon, UserIcon } from '../components';
import { Colors } from '../theme/colors';
import { apiListarConversaciones, apiTomarConversacion, type ConversacionDto } from '../api';
import { useAuthContext } from '../context/AuthContext';
import type { NavigateFn } from '../types/navigation';

interface AdminChatsScreenProps {
  onNavigate: NavigateFn;
}

const ESTADO_COLOR: Record<string, string> = {
  ABIERTA:     Colors.orange,
  EN_ATENCION: Colors.primary,
  CERRADA:     Colors.gray,
};

export function AdminChatsScreen({ onNavigate }: AdminChatsScreenProps) {
  const { currentUser } = useAuthContext();
  const [conversaciones, setConversaciones] = useState<ConversacionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tomando, setTomando] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      const data = await apiListarConversaciones();
      setConversaciones(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const navToChat = (conv: ConversacionDto) => {
    onNavigate('chatSoporte', {
      conversacionId: conv.id,
      titulo: conv.duenioNombre,
      productoId: conv.productoId ?? undefined,
      productoTitulo: conv.productoTitulo ?? undefined,
      productoEstado: conv.productoEstadoInspeccion ?? undefined,
      productoMotivo: conv.productoMotivoRechazo ?? undefined,
    });
  };

  const tomar = async (conv: ConversacionDto) => {
    if (conv.estado !== 'ABIERTA') {
      navToChat(conv);
      return;
    }
    setTomando(conv.id);
    try {
      await apiTomarConversacion(conv.id);
      navToChat(conv);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo tomar la conversación');
      setTomando(null);
    }
  };

  const abiertas    = conversaciones.filter((c) => c.estado === 'ABIERTA');
  const enAtencion  = conversaciones.filter((c) => c.estado === 'EN_ATENCION');
  const rolLabel    = currentUser?.roles?.includes('ADMIN') ? 'Administrador' : 'Empleado';
  const initials    = currentUser?.email?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header admin ─────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Panel de control</Text>
          <Text style={styles.headerTitle}>Soporte</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={styles.rolPill}>
            <Text style={styles.rolText}>{rolLabel}</Text>
          </View>
        </View>
      </View>

      {/* ── Stats ────────────────────────────────────── */}
      <View style={styles.statsRow}>
        <StatCard label="Pendientes" value={abiertas.length} color={Colors.orange} />
        <StatCard label="En atención" value={enAtencion.length} color={Colors.primary} />
        <StatCard label="Total" value={conversaciones.length} color={Colors.gray} />
      </View>

      {/* ── Lista ────────────────────────────────────── */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            <SectionHeader
              title="Esperando atención"
              count={abiertas.length}
              color={Colors.orange}
            />
            {abiertas.length === 0 ? (
              <EmptyRow text="Sin conversaciones pendientes." />
            ) : (
              abiertas.map((conv) => (
                <ConvCard
                  key={conv.id}
                  conv={conv}
                  cargando={tomando === conv.id}
                  botonLabel="Tomar"
                  botonColor={Colors.orange}
                  onPress={() => tomar(conv)}
                />
              ))
            )}

            <SectionHeader
              title="En atención (mis chats)"
              count={enAtencion.length}
              color={Colors.primary}
              mt
            />
            {enAtencion.length === 0 ? (
              <EmptyRow text="No tenés conversaciones activas." />
            ) : (
              enAtencion.map((conv) => (
                <ConvCard
                  key={conv.id}
                  conv={conv}
                  cargando={tomando === conv.id}
                  botonLabel="Abrir"
                  botonColor={Colors.primary}
                  onPress={() => tomar(conv)}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      <BottomNav active="adminChats" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

/* ── Sub-componentes ─────────────────────────────────── */

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, count, color, mt }: { title: string; count: number; color: string; mt?: boolean }) {
  return (
    <View style={[sectionStyles.row, mt && { marginTop: 28 }]}>
      <View style={[sectionStyles.bar, { backgroundColor: color }]} />
      <Text style={sectionStyles.title}>{title}</Text>
      {count > 0 && (
        <View style={[sectionStyles.badge, { backgroundColor: color + '22' }]}>
          <Text style={[sectionStyles.badgeText, { color }]}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <Text style={{ color: Colors.gray2, fontSize: 13, marginBottom: 8, paddingLeft: 12 }}>{text}</Text>;
}

function ConvCard({
  conv, cargando, botonLabel, botonColor, onPress,
}: {
  conv: ConversacionDto; cargando: boolean;
  botonLabel: string; botonColor: string; onPress: () => void;
}) {
  const fecha = new Date(conv.updatedAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={cardStyles.wrap}>
      <View style={[cardStyles.dot, { backgroundColor: ESTADO_COLOR[conv.estado] ?? Colors.gray }]} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={cardStyles.iconWrap}>
            <UserIcon size={16} color={Colors.primary} />
          </View>
          <Text style={cardStyles.nombre}>{conv.duenioNombre}</Text>
        </View>
        <Text style={cardStyles.email}>{conv.duenioEmail}</Text>
        {conv.productoTitulo && (
          <Text style={cardStyles.producto}>Producto: {conv.productoTitulo}</Text>
        )}
        <Text style={cardStyles.fecha}>{fecha}</Text>
      </View>
      <TouchableOpacity
        style={[cardStyles.btn, { backgroundColor: botonColor + '15', borderColor: botonColor }]}
        onPress={onPress}
        disabled={cargando}
      >
        {cargando
          ? <ActivityIndicator size="small" color={botonColor} />
          : <Text style={[cardStyles.btnText, { color: botonColor }]}>{botonLabel}</Text>}
      </TouchableOpacity>
    </View>
  );
}

/* ── Estilos ─────────────────────────────────────────── */

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#0F172A' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  headerSub:   { fontSize: 12, color: '#94A3B8', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, marginTop: 2 },
  avatarWrap:  { alignItems: 'center', gap: 6 },
  avatarText:  { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, textAlign: 'center', textAlignVertical: 'center', lineHeight: 44, fontSize: 16, fontWeight: '700', color: Colors.white },
  rolPill:     { backgroundColor: '#1E293B', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  rolText:     { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  statsRow:    { flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingBottom: 20 },
  scroll:      { flex: 1, backgroundColor: Colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  content:     { paddingHorizontal: 20, paddingVertical: 24 },
});

const statStyles = StyleSheet.create({
  card:  { flex: 1, backgroundColor: '#1E293B', borderRadius: 14, padding: 14, borderTopWidth: 3 },
  value: { fontSize: 24, fontWeight: '800' },
  label: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '600' },
});

const sectionStyles = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  bar:       { width: 3, height: 16, borderRadius: 2 },
  title:     { fontSize: 14, fontWeight: '700', color: Colors.dark, flex: 1 },
  badge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

const cardStyles = StyleSheet.create({
  wrap:     { backgroundColor: Colors.white, borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  dot:      { width: 8, height: 8, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  iconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  nombre:   { fontSize: 14, fontWeight: '700', color: Colors.dark },
  email:    { fontSize: 12, color: Colors.gray, marginTop: 2 },
  producto: { fontSize: 11, color: Colors.primary, marginTop: 3, fontWeight: '600' },
  fecha:    { fontSize: 11, color: Colors.gray2, marginTop: 4 },
  btn:      { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5 },
  btnText:  { fontSize: 13, fontWeight: '700' },
});
