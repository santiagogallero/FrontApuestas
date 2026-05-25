import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { Navigator } from './src/navigation/Navigator';

export default function App() {
  return (
    <AuthProvider>
      <Navigator />
      <StatusBar style="dark" />
    </AuthProvider>
  );
}
