import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary' | 'outline';
  icon?: string;
}

export function AppButton({ title, onPress, loading, variant = 'primary', icon }: AppButtonProps) {
  const bg = variant === 'primary' ? Colors.primary : variant === 'danger' ? Colors.red : Colors.gray4;
  const color = variant === 'primary' || variant === 'danger' ? Colors.white : Colors.dark;
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg }, variant === 'outline' && styles.outline]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.inner}>
          <Text style={[styles.text, { color }]}>{title}</Text>
          {icon && <Text style={[styles.icon, { color }]}>{icon}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.gray3,
    shadowOpacity: 0,
    elevation: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 18,
    marginLeft: 8,
  },
});
