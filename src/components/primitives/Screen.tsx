import { ScrollView, StatusBar, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, type SpacingToken } from '@/theme';

export type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: SpacingToken;
  contentContainerStyle?: ViewStyle;
};

export function Screen({
  children,
  scrollable = false,
  padding = 'base',
  contentContainerStyle,
}: ScreenProps) {
  const pad = spacing[padding];
  const content: ViewStyle = { padding: pad, flexGrow: 1 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.obsidian }} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.obsidian} />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
