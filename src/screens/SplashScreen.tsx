import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Logo, SparkleIcon } from '../components';
import { Colors } from '../theme/colors';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Logo size={120} strokeWidth={2} />
        <View style={styles.sparkleTop}>
          <SparkleIcon size={22} color={Colors.primary} />
        </View>
        <View style={styles.sparkleBottom}>
          <SparkleIcon size={14} color={Colors.primary} />
        </View>
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
    justifyContent: 'center',
    marginBottom: 12,
  },
  sparkleTop: {
    position: 'absolute',
    top: -4,
    right: 6,
  },
  sparkleBottom: {
    position: 'absolute',
    bottom: 4,
    left: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 8,
  },
});
