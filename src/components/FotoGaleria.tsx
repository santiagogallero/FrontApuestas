import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { API_BASE, apiGetFotosArticulo } from '../api';
import { Colors } from '../theme/colors';

interface Props {
  productoId: number;
  cantidadFotos: number;
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function FotoGaleria({ productoId, cantidadFotos, height = 220 }: Props) {
  const [fotoIds, setFotoIds] = useState<number[]>([]);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    if (cantidadFotos <= 0) {
      setFotoIds([]);
      return;
    }
    apiGetFotosArticulo(productoId)
      .then(setFotoIds)
      .catch(() => setFotoIds([]));
  }, [productoId, cantidadFotos]);

  if (fotoIds.length === 0) {
    return null;
  }

  const anchoImagen = SCREEN_WIDTH - 40;

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / anchoImagen);
          setActivo(index);
        }}
      >
        {fotoIds.map((fotoId) => (
          <Image
            key={fotoId}
            source={{ uri: `${API_BASE}/api/productos/${productoId}/fotos/${fotoId}` }}
            style={{ width: anchoImagen, height, borderRadius: 12, backgroundColor: Colors.gray4 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {fotoIds.length > 1 ? (
        <View style={styles.indicadorRow}>
          <Text style={styles.indicadorText}>
            {activo + 1} / {fotoIds.length}
          </Text>
          <View style={styles.dots}>
            {fotoIds.map((fotoId, i) => (
              <View key={fotoId} style={[styles.dot, i === activo && styles.dotActive]} />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  indicadorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  indicadorText: { fontSize: 12, color: Colors.gray, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gray4 },
  dotActive: { backgroundColor: Colors.primary },
});
