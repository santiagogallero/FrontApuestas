import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDownIcon } from './icons';
import { Colors } from '../theme/colors';

interface AppSelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AppSelect({ label, value, options, onChange, placeholder = 'Seleccionar' }: AppSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.box} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
        <ChevronDownIcon size={20} color={Colors.gray2} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && styles.optionActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
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
    justifyContent: 'space-between',
    backgroundColor: Colors.gray4,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  value: { fontSize: 15, color: Colors.dark },
  placeholder: { color: Colors.gray2 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    maxHeight: 360,
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionText: { fontSize: 16, color: Colors.dark },
  optionActive: { color: Colors.primary, fontWeight: '700' },
});
