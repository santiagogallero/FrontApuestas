export const Colors = {
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
} as const;

export type ColorKey = keyof typeof Colors;
