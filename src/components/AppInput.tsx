import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  iconLeft?: string;
  iconRight?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

export function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secure,
  iconLeft,
  iconRight,
  keyboardType = 'default',
}: AppInputProps) {
  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.box}>
        {iconLeft && <Text style={[styles.icon, styles.iconLeft]}>{iconLeft}</Text>}
        <TextInput
          style={[styles.field, { paddingLeft: iconLeft ? 40 : 16 }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray2}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {iconRight && <Text style={[styles.icon, styles.iconRight]}>{iconRight}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
    letterSpacing: 1,
    marginBottom: 6,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray4,
    borderRadius: 12,
    height: 52,
  },
  field: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    fontSize: 16,
    color: Colors.gray2,
    zIndex: 1,
  },
  iconLeft: {
    left: 14,
  },
  iconRight: {
    right: 14,
  },
});
