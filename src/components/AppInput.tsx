import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightPress?: () => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

function renderIcon(icon: React.ReactNode, style: object) {
  if (icon == null) return null;
  if (typeof icon === 'string' || typeof icon === 'number') {
    return <Text style={[styles.icon, style]}>{icon}</Text>;
  }
  return <View style={[styles.iconNode, style]}>{icon}</View>;
}

export function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secure,
  iconLeft,
  iconRight,
  onIconRightPress,
  keyboardType = 'default',
}: AppInputProps) {
  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.box}>
        {renderIcon(iconLeft, styles.iconLeft)}
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
        {iconRight != null && (
          onIconRightPress ? (
            <TouchableOpacity style={[styles.iconNode, styles.iconRight]} onPress={onIconRightPress} hitSlop={8}>
              {typeof iconRight === 'string' ? <Text style={styles.icon}>{iconRight}</Text> : iconRight}
            </TouchableOpacity>
          ) : (
            renderIcon(iconRight, styles.iconRight)
          )
        )}
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
  iconNode: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    left: 14,
  },
  iconRight: {
    right: 14,
  },
});
