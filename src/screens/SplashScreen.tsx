import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.icon}>⚡</Text>
        <View style={styles.hammer} />
      </View>
      <Text style={styles.title}>Auction Pulse Pro</Text>
      <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
  },
  hammer: {
    width: 60,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 16,
  },
});
