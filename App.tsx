import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// ─── Colors ───
const C = {
  primary: '#0052FF',
  primaryDark: '#0043D1',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  dark: '#0F172A',
  dark2: '#1E293B',
  gray: '#64748B',
  gray2: '#94A3B8',
  gray3: '#CBD5E1',
  gray4: '#F1F5F9',
  green: '#059669',
  greenLight: '#D1FAE5',
  red: '#DC2626',
  redLight: '#FEE2E2',
  orange: '#F59E0B',
  orangeLight: '#FEF3C7',
  blueLight: '#EFF6FF',
};

// ─── Types ───
type Screen =
  | 'splash'
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'accountPending'
  | 'recuperarCuenta'
  | 'subastas'
  | 'detalleSubasta'
  | 'billetera'
  | 'ventas'
  | 'cuenta'
  | 'ajustes'
  | 'seguros'
  | 'misProductos'
  | 'detalleAdjudicacion'
  | 'finalizarCompra'
  | 'pagoExitoso'
  | 'pagoFallido'
  | 'chatSoporte';

type NavState = {
  screen: Screen;
  params?: Record<string, any>;
};

// ─── Mock Data ───
const SUBASTAS = [
  {
    id: '1',
    title: 'Colección de relojes de lujo',
    date: 'Oct 24, 2024 - 10:00 AM',
    price: '$1,500 USD',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop',
    category: 'Oro',
    status: 'live',
    statusLabel: 'LIVE',
  },
  {
    id: '2',
    title: 'Piezas de arte moderno',
    date: 'Oct 26, 2024 - 02:30 PM',
    price: '$8,200 USD',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
    category: 'Platino',
    status: 'upcoming',
    statusLabel: 'PRÓXIMAMENTE',
  },
  {
    id: '3',
    title: 'Moneda antigua de oro',
    date: 'Oct 28, 2024 - 11:00 AM',
    price: '$3,200 USD',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=400&fit=crop',
    category: 'Oro',
    status: 'live',
    statusLabel: 'LIVE',
  },
];

const OFERTAS = [
  {
    id: '1',
    title: 'Monopatín eléctrico',
    status: 'LIDERANDO',
    statusColor: C.green,
    statusBg: C.greenLight,
    myBid: '$30,000',
    lastBid: '$30,000',
    timeLeft: '14:35:01 horas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Monopatín eléctrico Pro',
    status: 'PERDIENDO',
    statusColor: C.red,
    statusBg: C.redLight,
    myBid: '$28,000',
    lastBid: '$30,000',
    timeLeft: '14:35:01 horas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Moneda antigua',
    status: 'ADJUDICADA',
    statusColor: C.primary,
    statusBg: C.blueLight,
    myBid: '$32,000',
    lastBid: null,
    timeLeft: null,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Leica M3 Film',
    status: 'PERDIDA',
    statusColor: C.gray,
    statusBg: C.gray4,
    myBid: '$3,100',
    lastBid: null,
    finalPrice: '$4,500',
    date: 'Finalizado el 10/05/2024',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop',
  },
];

const PRODUCTOS = [
  {
    id: '1',
    title: 'Apple Watch Ultra II',
    status: 'VENDIDO',
    statusColor: C.green,
    statusBg: C.greenLight,
    initialPrice: '$30,000',
    soldTo: '$50,000',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Monopatín eléctrico',
    status: 'APROBADO',
    statusColor: C.primary,
    statusBg: C.blueLight,
    initialPrice: '$30,000',
    soldTo: '-',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Toyota Corolla',
    status: 'RECHAZADO',
    statusColor: C.red,
    statusBg: C.redLight,
    initialPrice: '$300,000',
    soldTo: '-',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=300&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Apple iPhone Air',
    status: 'PENDIENTE',
    statusColor: C.gray,
    statusBg: C.gray4,
    initialPrice: '$50,000',
    soldTo: '-',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=300&h=300&fit=crop',
  },
];

// ─── Reusable Components ───

function Logo({ size = 32 }: { size?: number }) {
  return (
    <View style={[styles.logoBox, { width: size, height: size }]}>
      <Text style={[styles.logoText, { fontSize: size * 0.5 }]}>⚡</Text>
    </View>
  );
}

function AppHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={styles.appHeader}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.headerBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerBack}>
          <Logo size={28} />
        </View>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

function AppButton({ title, onPress, loading, variant = 'primary', icon }: any) {
  const bg = variant === 'primary' ? C.primary : variant === 'danger' ? C.red : C.gray4;
  const color = variant === 'primary' || variant === 'danger' ? C.white : C.dark;
  return (
    <TouchableOpacity
      style={[styles.appButton, { backgroundColor: bg }, variant === 'outline' && styles.appButtonOutline]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.appButtonInner}>
          <Text style={[styles.appButtonText, { color }]}>{title}</Text>
          {icon && <Text style={[styles.appButtonIcon, { color }]}>{icon}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

function AppInput({ label, placeholder, value, onChangeText, secure, iconLeft, iconRight, keyboardType }: any) {
  return (
    <View style={styles.inputWrap}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputBox}>
        {iconLeft && <Text style={styles.inputIconLeft}>{iconLeft}</Text>}
        <TextInput
          style={[styles.inputField, { paddingLeft: iconLeft ? 40 : 16 }]}
          placeholder={placeholder}
          placeholderTextColor={C.gray2}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
        />
        {iconRight && <Text style={styles.inputIconRight}>{iconRight}</Text>}
      </View>
    </View>
  );
}

function BottomNav({ active, onNavigate }: { active: string; onNavigate: (s: Screen) => void }) {
  const tabs = [
    { key: 'subastas', label: 'Subastas', icon: '🔨' },
    { key: 'ventas', label: 'Ventas', icon: '📈' },
    { key: 'billetera', label: 'Billetera', icon: '💳' },
    { key: 'cuenta', label: 'Cuenta', icon: '👤' },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <TouchableOpacity key={t.key} style={styles.navItem} onPress={() => onNavigate(t.key as Screen)}>
            <View style={[styles.navIconBox, isActive && styles.navIconBoxActive]}>
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{t.icon}</Text>
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Toggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity
      style={[styles.toggleTrack, value && styles.toggleTrackOn]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.9}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </TouchableOpacity>
  );
}

function StatusBadge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Text style={[styles.statusBadgeText, { color }]}>{text}</Text>
    </View>
  );
}

// ─── Screens ───

function SplashScreen() {
  return (
    <View style={[styles.container, styles.center]}>
      <View style={styles.splashLogoWrap}>
        <Text style={styles.splashIcon}>⚡</Text>
        <View style={styles.splashHammer} />
      </View>
      <Text style={styles.splashTitle}>Auction Pulse Pro</Text>
      <ActivityIndicator size="small" color={C.primary} style={{ marginTop: 24 }} />
    </View>
  );
}

function LoginScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('subastas');
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginTop}>
          <Logo size={28} />
          <Text style={styles.loginBrand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.loginTitle}>Bienvenido</Text>
          <Text style={styles.loginSubtitle}>Inicia sesion para ver tu dashboard profesional de subastas</Text>

          <AppInput
            label="CORREO"
            placeholder="name@firm.com"
            value={email}
            onChangeText={setEmail}
            iconLeft="@"
            keyboardType="email-address"
          />

          <AppInput
            label="CONTRASEÑA"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secure
            iconLeft="🔒"
            iconRight="👁"
          />

          <TouchableOpacity style={styles.forgotLink} onPress={() => onNavigate('recuperarCuenta')}>
            <Text style={styles.forgotLinkText}>¿OLVIDASTE TU CONTRASEÑA?</Text>
          </TouchableOpacity>

          <AppButton title="Iniciar Sesión" icon="→" onPress={handleLogin} loading={loading} />

          <View style={styles.loginFooter}>
            <Text style={styles.loginFooterText}>Eres nuevo? </Text>
            <TouchableOpacity onPress={() => onNavigate('register')}>
              <Text style={styles.loginFooterLink}>Registrate</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ alignSelf: 'center', marginTop: 8 }} onPress={() => onNavigate('subastas')}>
            <Text style={[styles.loginFooterLink, { textDecorationLine: 'underline' }]}>Continuar sin logearte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

function RegisterScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('verifyEmail');
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginTop}>
          <Logo size={28} />
          <Text style={styles.loginBrand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.loginTitle, { fontSize: 32 }]}>Registro 1/2</Text>
          <Text style={styles.loginSubtitle}>Auction Pulse Pro.</Text>

          <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 16 }]}>Datos Personales</Text>

          <AppInput label="NOMBRE" placeholder="Ej. Alejandro" value={firstName} onChangeText={setFirstName} />
          <AppInput label="APELLIDO" placeholder="Ej. Rossi" value={lastName} onChangeText={setLastName} />
          <AppInput
            label="CORREO ELECTRÓNICO"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppInput label="CONTRASEÑA" placeholder="••••••••" value={password} onChangeText={setPassword} secure />
          <AppInput
            label="CONFIRMAR CONTRASEÑA"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secure
          />

          <AppButton title="Enviar documentacion" icon="→" onPress={handleRegister} loading={loading} />

          <View style={styles.loginFooter}>
            <Text style={styles.loginFooterText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => onNavigate('login')}>
              <Text style={styles.loginFooterLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

function VerifyEmailScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!email || !confirmEmail) {
      Alert.alert('Error', 'Completa ambos campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('accountPending');
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginTop}>
          <Logo size={28} />
          <Text style={styles.loginBrand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { marginBottom: 24 }]}>
            <Text style={{ fontSize: 32 }}>🛡️</Text>
          </View>

          <Text style={styles.loginTitle}>Verificación de correo</Text>
          <Text style={styles.loginSubtitle}>
            Por favor, introduce y confirma tu dirección de correo electrónico para recibir el código de verificación.
          </Text>

          <AppInput
            label="CORREO"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            iconRight="✉️"
            keyboardType="email-address"
          />
          <AppInput
            label="CONFIRMACION DE CORREO"
            placeholder="example@email.com"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            iconRight="✉️"
            keyboardType="email-address"
          />

          <AppButton title="Enviar código de verificación" icon="▶" onPress={handleVerify} loading={loading} />

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoCardTitle}>Protección de datos</Text>
              <Text style={styles.infoCardDesc}>Tus datos se cifran para una verificación segura.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}

function AccountPendingScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <View style={[styles.container, { backgroundColor: '#1e293b' }]}>
      <View style={styles.center}>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingBadgeText}>ACCESO EN REVISION</Text>
        </View>
        <Text style={[styles.loginTitle, { color: C.white, marginTop: 24 }]}>Cuenta en verificación</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, maxWidth: width * 0.7 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>⚡</Text>
          <Text style={{ color: C.gray3, fontSize: 16, lineHeight: 24 }}>
            Su cuenta esta siendo verificada en aproximadamente tarda 24hs.
          </Text>
        </View>
      </View>
      <View style={{ padding: 20, paddingBottom: 40 }}>
        <AppButton title="Iniciar sesión" variant="secondary" onPress={() => onNavigate('login')} />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

function RecuperarCuentaScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = () => {
    if (!email || !confirmEmail) {
      Alert.alert('Error', 'Completa ambos campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Enviado', 'Se ha enviado un código de verificación a tu correo');
      onNavigate('login');
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginTop}>
          <Logo size={28} />
          <Text style={styles.loginBrand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { marginBottom: 24 }]}>
            <Text style={{ fontSize: 32 }}>🛡️</Text>
          </View>

          <Text style={styles.loginTitle}>Recuperacion de la cuenta</Text>
          <Text style={styles.loginSubtitle}>
            Por favor escriba su correo para el recupero de su contraseña y se le enviara un codigo
          </Text>

          <AppInput label="CORREO" placeholder="example@email.com" value={email} onChangeText={setEmail} iconRight="✉️" />
          <AppInput
            label="CONFIRMAR CORREO"
            placeholder="example@email.com"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            iconRight="✉️"
          />

          <AppButton title="Recuperar cuenta" icon="▶" onPress={handleRecover} loading={loading} />

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoCardTitle}>Protección de datos</Text>
              <Text style={styles.infoCardDesc}>Tus datos se cifran para una verificación segura.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </KeyboardAvoidingView>
  );
}


function SubastasScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [filter, setFilter] = useState('Todas');
  const filters = ['Todas', 'Comunes', 'Plata', 'Oro'];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Subastas" right={<View style={styles.avatarCircle}><Text style={styles.avatarText}>AS</Text></View>} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>Subastas disponibles</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {SUBASTAS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.auctionCard}
              onPress={() => onNavigate('detalleSubasta', { item })}
              activeOpacity={0.9}
            >
              <View style={styles.auctionImageWrap}>
                <Image source={{ uri: item.image }} style={styles.auctionImage} />
                <View style={styles.auctionBadges}>
                  <View style={[styles.badge, item.status === 'live' ? styles.badgeLive : styles.badgeUpcoming]}>
                    <Text style={[styles.badgeText, item.status === 'live' ? styles.badgeLiveText : styles.badgeUpcomingText]}>
                      {item.status === 'live' ? '● ' : ''}{item.statusLabel}
                    </Text>
                  </View>
                  <View style={styles.badgeCategory}>
                    <Text style={styles.badgeCategoryText}>CATEGORÍA {item.category.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.auctionBody}>
                <Text style={styles.auctionTitle}>{item.title}</Text>
                <View style={styles.auctionMeta}>
                  <Text style={styles.auctionMetaText}>🗓 {item.date}</Text>
                </View>
                <View style={styles.auctionFooter}>
                  <View>
                    <Text style={styles.auctionPriceLabel}>PRECIO BASE</Text>
                    <Text style={styles.auctionPrice}>{item.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.auctionButton} onPress={() => onNavigate('detalleSubasta', { item })}>
                    <Text style={styles.auctionButtonText}>
                      {item.status === 'live' ? 'Ingresar a la subasta' : 'No disponible'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function DetalleSubastaScreen({ onNavigate, params }: { onNavigate: (s: Screen, params?: any) => void; params?: any }) {
  const item = params?.item || SUBASTAS[0];
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Subastas" onBack={() => onNavigate('subastas')} right={<Text style={{ fontSize: 20 }}>🔔</Text>} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>SUBASTA EN VIVO</Text>
          </View>

          <Image source={{ uri: item.image }} style={styles.detailImage} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {[item.image, item.image, item.image, item.image, item.image].map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={[styles.detailThumb, i === 0 && styles.detailThumbActive]}
              />
            ))}
            <View style={styles.detailThumbMore}>
              <Text style={styles.detailThumbMoreText}>+2</Text>
            </View>
          </ScrollView>

          <Text style={[styles.screenTitle, { marginTop: 20 }]}>{item.title}</Text>
          <Text style={styles.detailSubtitle}>Lot #742 • Edition 04/50</Text>

          <View style={styles.bidCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.bidLabel}>CURRENT BID</Text>
                <Text style={styles.bidPrice}>$1,500 <Text style={{ fontSize: 16, color: C.gray }}>USD</Text></Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.badge, { backgroundColor: C.greenLight }]}>
                  <Text style={[styles.badgeText, { color: C.green }]}>👤 User #8821</Text>
                </View>
                <Text style={{ color: C.gray, fontSize: 12, marginTop: 4 }}>Hace 4 segundos</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
              <TouchableOpacity style={styles.bidButton}>
                <Text style={styles.bidButtonLabel}>APUESTA RÁPIDA +1%</Text>
                <Text style={styles.bidButtonPrice}>$1,515</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bidButton, { backgroundColor: C.white, borderWidth: 1, borderColor: C.gray3 }]}>
                <Text style={[styles.bidButtonLabel, { color: C.dark }]}>ENTRADA MANUAL</Text>
                <Text style={[styles.bidButtonPrice, { color: C.dark, fontSize: 14, fontWeight: '400' }]}>Oferta personalizada</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ color: C.gray, fontSize: 12 }}>Min: $1,515 | Max: $ 1,800</Text>
              <Text style={{ color: C.green, fontSize: 12 }}>🛡️ Seguro: Activo</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function BilleteraScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Mi billetera" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Métodos de pago registrados</Text>

          <View style={[styles.paymentCard, { backgroundColor: C.primary }]}>
            <View style={styles.paymentIconBox}>
              <Text style={{ fontSize: 20 }}>💳</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: C.white }]}>Tarjeta Visa que termina en 4242</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#93C5FD', marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: '#93C5FD' }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentCard, { backgroundColor: C.gray4, marginTop: 12 }]}>
            <View style={[styles.paymentIconBox, { backgroundColor: C.white }]}>
              <Text style={{ fontSize: 20 }}>🏦</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: C.dark }]}>Cuenta bancaria de Chase que termina en 7856</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: C.gray, marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: C.gray }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.balanceCard, { marginTop: 32 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Saldo disponible</Text>
            <Text style={{ color: C.gray, fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              Fondos listos para tus próximas ofertas y compras en la plataforma.
            </Text>
            <Text style={styles.balanceAmount}>$12,480.00</Text>
          </View>

          <AppButton title="+ Agregar método de pago" icon="🔒" onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')} />
        </View>
      </ScrollView>
      <BottomNav active="billetera" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function VentasScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Activo', 'Liderando', 'Perdiendo'];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Historial de ofertas" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>OFERTAS TOTALES</Text>
              <Text style={styles.statValue}>128</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DINERO EN SUBASTAS ACTIVAS</Text>
              <Text style={[styles.statValue, { color: C.green }]}>$ 12,000.00</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {OFERTAS.map((item) => (
            <View key={item.id} style={styles.offerCard}>
              <Image source={{ uri: item.image }} style={styles.offerImage} />
              <View style={styles.offerBody}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <StatusBadge text={item.status} color={item.statusColor} bg={item.statusBg} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 24 }}>
                  <View>
                    <Text style={styles.offerLabel}>TU APUESTA</Text>
                    <Text style={styles.offerValue}>{item.myBid}</Text>
                  </View>
                  {item.lastBid && (
                    <View>
                      <Text style={styles.offerLabel}>ULTIMA APUESTA</Text>
                      <Text style={[styles.offerValue, { color: C.primary }]}>{item.lastBid}</Text>
                    </View>
                  )}
                  {item.finalPrice && (
                    <View>
                      <Text style={styles.offerLabel}>PRECIO FINAL</Text>
                      <Text style={styles.offerValue}>{item.finalPrice}</Text>
                    </View>
                  )}
                </View>
                {item.timeLeft ? (
                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <TouchableOpacity>
                      <Text style={styles.offerLink}>Ver subasta</Text>
                    </TouchableOpacity>
                    <Text style={{ color: C.gray, fontSize: 12, marginLeft: 'auto' }}>Quedan{'\n'}{item.timeLeft}</Text>
                  </View>
                ) : item.date ? (
                  <View style={{ marginTop: 8 }}>
                    <Text style={{ color: C.gray, fontSize: 12 }}>🗓 {item.date}</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={{ marginTop: 8 }}>
                    <Text style={styles.offerLink}>Ver detalles</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav active="ventas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function CuentaScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const menuItems = [
    { icon: '💳', label: 'Métodos de pago', badge: '3 Verificado', badgeColor: C.green, badgeBg: C.greenLight, screen: 'billetera' as Screen },
    { icon: '📋', label: 'Historial de ofertas', screen: 'ventas' as Screen },
    { icon: '📦', label: 'Mis productos', screen: 'misProductos' as Screen },
    { icon: '🛡️', label: 'Seguros y Seguridad', screen: 'seguros' as Screen },
    { icon: '⚙️', label: 'Ajustes', screen: 'ajustes' as Screen },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center', paddingTop: 20 }]}>
          <View style={styles.profileAvatarWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileBadge}>
              <Text style={{ fontSize: 10 }}>✅</Text>
            </View>
          </View>
          <Text style={[styles.screenTitle, { marginTop: 12 }]}>Adam Smith</Text>
          <View style={styles.categoryBadge}>
            <Text style={{ fontSize: 12, marginRight: 4 }}>🏆</Text>
            <Text style={styles.categoryBadgeText}>CATEGORÍA ORO</Text>
          </View>

          <View style={styles.progressBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: C.gray, fontSize: 12, fontWeight: '600' }}>PROGRESO DE NIVEL</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: C.dark, fontSize: 14 }}>Siguiente: PLATINO</Text>
              <Text style={{ color: C.primary, fontSize: 14, fontWeight: '600' }}>74%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '74%' }]} />
            </View>
          </View>

          <View style={styles.statsRowAccount}>
            <View style={styles.statAccount}>
              <Text style={styles.statAccountValue}>42</Text>
              <Text style={styles.statAccountLabel}>SUBASTAS</Text>
            </View>
            <View style={styles.statAccount}>
              <Text style={[styles.statAccountValue, { color: C.green }]}>12</Text>
              <Text style={styles.statAccountLabel}>GANADO</Text>
            </View>
            <View style={styles.statAccount}>
              <Text style={styles.statAccountValue}>$142k</Text>
              <Text style={styles.statAccountLabel}>PAGADO</Text>
            </View>
          </View>

          <View style={{ width: '100%', marginTop: 8 }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => onNavigate(item.screen)}
              >
                <View style={styles.menuIconBox}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge && (
                  <View style={[styles.menuBadge, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.menuBadgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => onNavigate('login')}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>⎋</Text>
            <Text style={styles.logoutText}>FINALIZAR LA SESIÓN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav active="cuenta" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function AjustesScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [settings, setSettings] = useState({
    notificaciones: true,
    idioma: false,
    biometrico: true,
    moneda: false,
    modoOscuro: false,
  });

  const items = [
    { key: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
    { key: 'idioma', label: 'Idioma: Español', icon: '🌐' },
    { key: 'biometrico', label: 'Autenticación biométrica', icon: '🔐' },
    { key: 'moneda', label: 'Moneda: USD', icon: '$' },
    { key: 'modoOscuro', label: 'Modo oscuro', icon: '🌙' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Ajustes" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Preferencias de la cuenta</Text>
          {items.map((item) => (
            <View key={item.key} style={styles.settingRow}>
              <View style={styles.menuIconBox}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Toggle
                value={settings[item.key as keyof typeof settings]}
                onValueChange={(v) => setSettings((s) => ({ ...s, [item.key]: v }))}
              />
            </View>
          ))}

          <AppButton title="Guardar cambios" onPress={() => Alert.alert('Guardado', 'Tus preferencias se han actualizado')} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SegurosScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Seguros y Seguridad" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { alignSelf: 'center', marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>🛡️</Text>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Tu confianza, asegurada</Text>
          <Text style={[styles.loginSubtitle, { textAlign: 'center' }]}>
            Cada operación realizada en la plataforma está respaldada por pólizas de aseguradoras certificadas a nivel internacional.
          </Text>

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <Text style={[styles.infoCardTitle, { fontSize: 18 }]}>¿Por qué trabajamos con seguros?</Text>
            <Text style={[styles.infoCardDesc, { marginTop: 8 }]}>
              Protegemos cada transacción para que compradores y vendedores operen sin miedo a pérdidas, fraudes o disputas. La seguridad no es opcional: es el corazón del servicio.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 16 }}>
              <Text style={{ color: C.primary, fontSize: 28, fontWeight: 'bold' }}>100%</Text>
              <Text style={{ color: C.gray, fontSize: 14, marginLeft: 8 }}>de las operaciones cubiertas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MisProductosScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Vendidos', 'Pendientes', 'Aprobados'];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Mis productos" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MIS PRODUCTOS</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>VENDIDOS</Text>
              <Text style={[styles.statValue, { color: C.green }]}>3</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PENDIENTES</Text>
              <Text style={styles.statValue}>9</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {PRODUCTOS.map((item) => (
            <View key={item.id} style={styles.offerCard}>
              <Image source={{ uri: item.image }} style={styles.offerImage} />
              <View style={styles.offerBody}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <StatusBadge text={item.status} color={item.statusColor} bg={item.statusBg} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 24 }}>
                  <View>
                    <Text style={styles.offerLabel}>PRECIO INICIAL</Text>
                    <Text style={[styles.offerValue, { color: C.primary }]}>{item.initialPrice}</Text>
                  </View>
                  <View>
                    <Text style={styles.offerLabel}>VENDIDO A</Text>
                    <Text style={styles.offerValue}>{item.soldTo}</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ marginTop: 8 }}>
                  <Text style={styles.offerLink}>Ver detalle</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav active="ventas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}


function DetalleAdjudicacionScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  const status = 'PAGO APROBADO';
  const statusColor = C.green;
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Historial de ofertas" onBack={() => onNavigate('ventas')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Detalle de adjudicación</Text>
          <Text style={[styles.loginSubtitle, { marginBottom: 20 }]}>La validación técnica del activo ha finalizado.</Text>

          <View style={styles.adjCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.adjLabel}>STATUS ACTUAL</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.adjStatus, { color: statusColor }]}>{status}</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: C.blueLight }]}>
                <Text style={[styles.badgeText, { color: C.primary }]}>🛡️ Sentinel Certified</Text>
              </View>
            </View>

            <View style={styles.adjImageWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop' }}
                style={styles.adjImage}
              />
              <Text style={styles.adjImageLabel}>Patek AAA000</Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.offerLabel}>PRECIO FINAL</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.bidPrice}>$30,000</Text>
              <Text style={{ color: C.gray, fontSize: 16, marginLeft: 6 }}>USD</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.gray3 }}>
            <Text style={{ color: C.gray, fontSize: 16, flex: 1 }}>Gestionaremos la entrega por correo electrónico.</Text>
            <Text style={{ fontSize: 20 }}>📋</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FinalizarCompraScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Finalizar Compra" onBack={() => onNavigate('detalleAdjudicacion')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Finalizar Compra</Text>
          <Text style={[styles.loginSubtitle, { marginBottom: 20 }]}>Elige un método de pago</Text>

          <View style={[styles.paymentCard, { backgroundColor: C.primary }]}>
            <View style={styles.paymentIconBox}>
              <Text style={{ fontSize: 20 }}>💳</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: C.white }]}>Tarjeta Visa que termina en 4242</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#93C5FD', marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: '#93C5FD' }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentCard, { backgroundColor: C.gray4, marginTop: 12 }]}>
            <View style={[styles.paymentIconBox, { backgroundColor: C.white }]}>
              <Text style={{ fontSize: 20 }}>🏦</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: C.dark }]}>Cuenta bancaria de Chase que termina en 7856</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: C.gray, marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: C.gray }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentCard, { backgroundColor: C.gray4, marginTop: 12 }]}>
            <View style={[styles.paymentIconBox, { backgroundColor: C.white }]}>
              <Text style={{ fontSize: 20 }}>🧾</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, { color: C.dark }]}>Recibo #100234</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: C.gray, marginRight: 4 }}>✅</Text>
                <Text style={[styles.paymentSub, { color: C.gray }]}>VERIFICADA</Text>
              </View>
            </View>
          </View>

          <View style={[styles.warningCard, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: C.red, marginBottom: 8 }]}>Política de pago</Text>
            <Text style={{ color: C.red, fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
              Si no se realiza el pago dentro de las 72 horas, se aplicará una penalización del 10% sobre el monto ofertado.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
              <Text style={{ color: C.red, fontSize: 24, fontWeight: 'bold' }}>$150.00</Text>
              <Text style={{ color: C.red, fontSize: 14, marginLeft: 8, opacity: 0.8 }}>(10% del precio de remate)</Text>
            </View>
          </View>

          <AppButton title="Pagar" icon="🔒" onPress={() => onNavigate('pagoExitoso')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PagoExitosoScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Estado de transaccion" onBack={() => onNavigate('subastas')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center' }]}>
          <View style={[styles.iconCircle, { backgroundColor: C.greenLight, marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>✅</Text>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Pago exitoso</Text>
          <Text style={[styles.loginSubtitle, { textAlign: 'center', fontSize: 12, letterSpacing: 1 }]}>
            ID DE TRANSACCIÓN: TXN-8829-4401-RTB
          </Text>

          <View style={[styles.badge, { backgroundColor: C.blueLight, marginTop: 16 }]}>
            <Text style={[styles.badgeText, { color: C.primary }]}>LOTE VERIFICADO</Text>
          </View>

          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=350&fit=crop' }}
            style={[styles.detailImage, { marginTop: 20 }]}
          />

          <Text style={[styles.screenTitle, { marginTop: 20, textAlign: 'center' }]}>Centinela de Plata Cronógrafo</Text>
          <Text style={[styles.loginSubtitle, { textAlign: 'center' }]}>Serial #2993-A | Limited Edition{'\n'}Sentinel Series</Text>

          <View style={[styles.statsRow, { width: '100%', marginTop: 24 }]}>
            <View>
              <Text style={styles.offerLabel}>TOTAL PAID</Text>
              <Text style={[styles.bidPrice, { fontSize: 28 }]}>$1,880.00</Text>
            </View>
            <TouchableOpacity style={[styles.filterChip, { borderWidth: 1, borderColor: C.gray3 }]}>
              <Text style={styles.filterChipText}>⬇️ Descargar Recibo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PagoFallidoScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Estado de transaccion" onBack={() => onNavigate('finalizarCompra')} />
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { alignItems: 'center' }]}>
          <View style={[styles.iconCircle, { backgroundColor: C.redLight, marginBottom: 20 }]}>
            <Text style={{ fontSize: 40 }}>❗</Text>
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Transacción fallida</Text>
          <Text style={[styles.loginSubtitle, { textAlign: 'center' }]}>
            Su pago fue rechazado por el banco emisor. Esto suele ocurrir debido a fondos insuficientes o restricciones de seguridad en transacciones de gran volumen.
          </Text>

          <View style={[styles.warningCard, { marginTop: 24, width: '100%' }]}>
            <Text style={[styles.sectionTitle, { color: C.red, marginBottom: 8 }]}>Política de pago</Text>
            <Text style={{ color: C.red, fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
              Si no se realiza el pago dentro de las 72 horas, se aplicará una penalización del 10% sobre el monto ofertado.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
              <Text style={{ color: C.red, fontSize: 24, fontWeight: 'bold' }}>$150.00</Text>
              <Text style={{ color: C.red, fontSize: 14, marginLeft: 8, opacity: 0.8 }}>(10% del precio de remate)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 32 }}>
        <AppButton title="Utilizar otro método de pago" variant="secondary" onPress={() => onNavigate('finalizarCompra')} />
      </View>
    </SafeAreaView>
  );
}

function ChatSoporteScreen({ onNavigate }: { onNavigate: (s: Screen, params?: any) => void }) {
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
      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text style={{ color: C.gray, fontSize: 12, textAlign: 'center' }}>● UNIDAD DE AUTENTICACIÓN</Text>
      </View>
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=200&h=150&fit=crop' }}
              style={{ width: 120, height: 90, borderRadius: 12 }}
            />
            <Text style={[styles.screenTitle, { marginTop: 12, textAlign: 'center' }]}>Toyota Corolla 2020</Text>
            <Text style={[styles.loginSubtitle, { textAlign: 'center' }]}>Patente AAA000 | 235.000 km</Text>
            <View style={[styles.badge, { backgroundColor: C.redLight, marginTop: 8 }]}>
              <Text style={[styles.badgeText, { color: C.red }]}>INSPECCIÓN RECHAZADA</Text>
            </View>
          </View>

          <Text style={{ color: C.primary, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>SENTINEL OFFICIAL   10:42 AM</Text>
          <View style={[styles.chatBubble, { alignSelf: 'flex-start', backgroundColor: C.gray4 }]}>
            <Text style={{ color: C.dark, fontSize: 14, lineHeight: 20 }}>
              Hola. Su inspeccion inicial fue rechazada. Necesitamos una foto de alta resolución de los papeles del vehículo para verificar su autenticidad
            </Text>
          </View>

          <View style={[styles.chatBubble, { alignSelf: 'flex-end', backgroundColor: C.primary }]}>
            <Text style={{ color: C.white, fontSize: 14, lineHeight: 20 }}>
              Hola. Te envío una imagen de los papeles del vehículo
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={[styles.badge, { backgroundColor: C.gray4 }]}>
              <Text style={[styles.badgeText, { color: C.gray }]}>●●●</Text>
            </View>
            <Text style={{ color: C.gray, fontSize: 12, marginLeft: 8 }}>EL EXPERTO ESTÁ ESCRIBIENDO...</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.chatInputBar}>
        <TouchableOpacity style={[styles.chatInputBtn, { width: 40 }]}>
          <Text style={{ fontSize: 20 }}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder="Escribe tu mensaje aquí..."
          placeholderTextColor={C.gray2}
        />
        <TouchableOpacity style={[styles.chatInputBtn, { width: 40 }]}>
          <Text style={{ fontSize: 20 }}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chatSendBtn]}>
          <Text style={{ color: C.white, fontSize: 16 }}>▶</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


// ─── Main App ───
export default function App() {
  const [nav, setNav] = useState<NavState>({ screen: 'splash' });

  // Splash timer
  useEffect(() => {
    if (nav.screen === 'splash') {
      const timer = setTimeout(() => {
        setNav({ screen: 'login' });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [nav.screen]);

  const navigate = (screen: Screen, params?: any) => {
    setNav({ screen, params });
  };

  const { screen, params } = nav;

  if (screen === 'splash') return <SplashScreen />;
  if (screen === 'login') return <LoginScreen onNavigate={navigate} />;
  if (screen === 'register') return <RegisterScreen onNavigate={navigate} />;
  if (screen === 'verifyEmail') return <VerifyEmailScreen onNavigate={navigate} />;
  if (screen === 'accountPending') return <AccountPendingScreen onNavigate={navigate} />;
  if (screen === 'recuperarCuenta') return <RecuperarCuentaScreen onNavigate={navigate} />;
  if (screen === 'subastas') return <SubastasScreen onNavigate={navigate} />;
  if (screen === 'detalleSubasta') return <DetalleSubastaScreen onNavigate={navigate} params={params} />;
  if (screen === 'billetera') return <BilleteraScreen onNavigate={navigate} />;
  if (screen === 'ventas') return <VentasScreen onNavigate={navigate} />;
  if (screen === 'cuenta') return <CuentaScreen onNavigate={navigate} />;
  if (screen === 'ajustes') return <AjustesScreen onNavigate={navigate} />;
  if (screen === 'seguros') return <SegurosScreen onNavigate={navigate} />;
  if (screen === 'misProductos') return <MisProductosScreen onNavigate={navigate} />;
  if (screen === 'detalleAdjudicacion') return <DetalleAdjudicacionScreen onNavigate={navigate} />;
  if (screen === 'finalizarCompra') return <FinalizarCompraScreen onNavigate={navigate} />;
  if (screen === 'pagoExitoso') return <PagoExitosoScreen onNavigate={navigate} />;
  if (screen === 'pagoFallido') return <PagoFallidoScreen onNavigate={navigate} />;
  if (screen === 'chatSoporte') return <ChatSoporteScreen onNavigate={navigate} />;

  return (
    <View style={styles.container}>
      <Text>Screen not found</Text>
    </View>
  );
}

// ─── Styles ───
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollBody: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // Logo
  logoBox: {
    backgroundColor: C.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: C.white,
    fontWeight: 'bold',
  },

  // Header
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (RNStatusBar.currentHeight || 0) + 12,
    paddingBottom: 12,
    backgroundColor: C.bg,
  },
  headerBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerBackText: {
    fontSize: 24,
    color: C.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },

  // Inputs
  inputWrap: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.gray,
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.gray4,
    borderRadius: 12,
    height: 52,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: C.dark,
    paddingRight: 40,
  },
  inputIconLeft: {
    position: 'absolute',
    left: 14,
    fontSize: 16,
    color: C.gray2,
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: 14,
    fontSize: 16,
    color: C.gray2,
    zIndex: 1,
  },

  // Button
  appButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  appButtonOutline: {
    borderWidth: 1,
    borderColor: C.gray3,
    shadowOpacity: 0,
    elevation: 0,
  },
  appButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appButtonIcon: {
    fontSize: 18,
    marginLeft: 8,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: C.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconBoxActive: {
    backgroundColor: C.blueLight,
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: C.gray,
    marginTop: 2,
  },
  navLabelActive: {
    color: C.primary,
    fontWeight: '600',
  },

  // Splash
  splashLogoWrap: {
    alignItems: 'center',
  },
  splashIcon: {
    fontSize: 64,
  },
  splashHammer: {
    width: 60,
    height: 8,
    backgroundColor: C.primary,
    borderRadius: 4,
    marginTop: 8,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: C.dark,
    marginTop: 16,
  },

  // Login
  loginTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 8,
  },
  loginBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: C.dark,
    marginLeft: 10,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: C.dark,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 15,
    color: C.gray,
    marginBottom: 28,
    lineHeight: 22,
  },
  forgotLink: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotLinkText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginFooterText: {
    color: C.gray,
    fontSize: 14,
  },
  loginFooterLink: {
    color: C.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  // Toggle
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.gray3,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: C.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.dark,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: C.dark,
    marginBottom: 16,
  },

  // Info card
  infoCard: {
    backgroundColor: C.gray4,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.dark,
  },
  infoCardDesc: {
    fontSize: 13,
    color: C.gray,
    lineHeight: 18,
    marginTop: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Pending
  pendingBadge: {
    backgroundColor: C.orange,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  pendingBadgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Filters
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: C.gray4,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: C.primary,
  },
  filterChipText: {
    color: C.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: C.white,
    fontWeight: '600',
  },

  // Auction card
  auctionCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  auctionImageWrap: {
    position: 'relative',
    height: 200,
  },
  auctionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  auctionBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeLive: {
    backgroundColor: C.red,
  },
  badgeUpcoming: {
    backgroundColor: C.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeLiveText: {
    color: C.white,
  },
  badgeUpcomingText: {
    color: C.white,
  },
  badgeCategory: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeCategoryText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
  },
  auctionBody: {
    padding: 16,
  },
  auctionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.dark,
  },
  auctionMeta: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  auctionMetaText: {
    color: C.gray,
    fontSize: 13,
  },
  auctionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  auctionPriceLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  auctionPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: C.primary,
    marginTop: 2,
  },
  auctionButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  auctionButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Detail
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.red,
    marginRight: 8,
  },
  liveText: {
    color: C.red,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  detailImage: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  detailThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 10,
    opacity: 0.6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  detailThumbActive: {
    opacity: 1,
    borderColor: C.primary,
  },
  detailThumbMore: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: C.gray4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailThumbMoreText: {
    color: C.gray,
    fontWeight: '600',
  },
  detailSubtitle: {
    color: C.gray,
    fontSize: 14,
    marginBottom: 16,
  },
  bidCard: {
    backgroundColor: C.gray4,
    borderRadius: 20,
    padding: 20,
  },
  bidLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bidPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: C.primary,
    marginTop: 4,
  },
  bidButton: {
    flex: 1,
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bidButtonLabel: {
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bidButtonPrice: {
    color: C.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },

  // Payment
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  paymentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  paymentSub: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  balanceCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: C.primary,
  },

  // Warning
  warningCard: {
    backgroundColor: C.redLight,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: C.red,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    color: C.gray,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: C.dark,
  },

  // Offers
  offerCard: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  offerBody: {
    flex: 1,
    marginLeft: 14,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.dark,
    flex: 1,
    marginRight: 8,
  },
  offerLabel: {
    fontSize: 10,
    color: C.gray,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  offerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.dark,
  },
  offerLink: {
    color: C.red,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Account
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  profileAvatarWrap: {
    position: 'relative',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: C.primary,
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.white,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.blueLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  categoryBadgeText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBox: {
    width: '100%',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: C.gray3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: C.primary,
    borderRadius: 4,
  },
  statsRowAccount: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 8,
  },
  statAccount: {
    flex: 1,
    alignItems: 'center',
  },
  statAccountValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: C.dark,
  },
  statAccountLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '600',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: C.dark,
    marginLeft: 12,
  },
  menuBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 20,
    color: C.gray2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  logoutText: {
    color: C.red,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  // Adjudicacion
  adjCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  adjLabel: {
    fontSize: 11,
    color: C.gray,
    fontWeight: '700',
    letterSpacing: 1,
  },
  adjStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  adjImageWrap: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  adjImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  adjImageLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: C.white,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Chat
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  chatInput: {
    flex: 1,
    height: 44,
    backgroundColor: C.gray4,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 15,
    color: C.dark,
    marginHorizontal: 8,
  },
  chatInputBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
});
