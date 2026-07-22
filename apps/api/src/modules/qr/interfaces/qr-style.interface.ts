export interface QrStyle {
  foregroundColor?: string;
  backgroundColor?: string;
  size?: number;
  margin?: number;
  logoUrl?: string;
  logoSize?: number;
  dotStyle?: 'square' | 'dot' | 'rounded';
  cornerStyle?: 'square' | 'dot' | 'rounded';
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal';
}
