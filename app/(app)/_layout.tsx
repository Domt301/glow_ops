import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Camera, Home, ListChecks, TrendingUp, User } from 'lucide-react-native';
import { colors, fontFamilies } from '@/theme';

function GlassTabBackground() {
  if (Platform.OS === 'web') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(20, 22, 27, 0.85)',
          borderTopWidth: 1,
          borderTopColor: colors.hairlineStrong,
        }}
      />
    );
  }
  return (
    <BlurView
      intensity={70}
      tint="dark"
      style={{
        flex: 1,
        backgroundColor: 'rgba(20, 22, 27, 0.55)',
        borderTopWidth: 1,
        borderTopColor: colors.hairlineStrong,
      }}
    />
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.steelDim,
        tabBarBackground: () => <GlassTabBackground />,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.interSemibold,
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Home color={color} size={size} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="protocol"
        options={{
          title: 'Protocol',
          tabBarIcon: ({ color, size, focused }) => (
            <ListChecks color={color} size={size} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, size, focused }) => (
            <Camera color={color} size={size} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size, focused }) => (
            <TrendingUp color={color} size={size} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <User color={color} size={size} strokeWidth={focused ? 2.25 : 1.75} />
          ),
        }}
      />
    </Tabs>
  );
}
