import { Text } from './Text';
import type { ColorToken } from '@/theme';

export type EyebrowProps = {
  children: React.ReactNode;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
};

export function Eyebrow({ children, color = 'steel', align }: EyebrowProps) {
  return (
    <Text variant="eyebrow" color={color} align={align}>
      {children}
    </Text>
  );
}
