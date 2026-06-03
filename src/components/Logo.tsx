import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface LogoProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Logo de marca: martillo de subasta (gavel) dibujado con SVG.
 * Reemplaza el emoji ⚡ anterior para matchear el diseño de Figma.
 */
export function Logo({ size = 32, color = Colors.primary, strokeWidth = 2.2 }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Mango del mazo */}
      <Path
        d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base / sound block */}
      <Path
        d="m16 16 6-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m8 8 6-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cabeza del mazo (trazos cruzados) */}
      <Path
        d="m9 7 8 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m21 11-8-8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
