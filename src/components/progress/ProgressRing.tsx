import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, type ColorToken } from '@/theme';
import { Text } from '@/components/primitives/Text';

export type ProgressRingProps = {
  value: number;
  size: number;
  label?: string;
  color?: ColorToken;
  thickness?: number;
};

export function ProgressRing({
  value,
  size,
  label,
  color = 'accent',
  thickness = 6,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.slate}
          strokeWidth={thickness}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors[color]}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text variant="stat" color="platinum">
          {Math.round(clamped)}
        </Text>
        {label ? (
          <Text variant="caption" color="steelDim">
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
