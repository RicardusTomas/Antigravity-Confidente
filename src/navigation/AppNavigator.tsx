import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';

import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatVoiceScreen from '../screens/ChatVoiceScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WellnessScreen from '../screens/WellnessScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NewEntryScreen from '../screens/NewEntryScreen';
import GlobalBackground from '../components/GlobalBackground';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Journal: { focused: 'book', default: 'book-outline' },
  Chat: { focused: 'chatbubble-ellipses', default: 'chatbubble-ellipses-outline' },
  Insights: { focused: 'analytics', default: 'analytics-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
};

function TabNavigator() {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName as any} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Journal" component={JournalScreen} options={{ tabBarLabel: 'Diário' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Confidente' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarLabel: 'Insights' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { darkMode } = useStore();
  const colors = useThemeColors();
  const MyTheme = {
    ...(darkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
    },
  };

  return (
    <GlobalBackground>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false, 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen 
            name="Wellness" 
            component={WellnessScreen}
            options={{ 
              presentation: 'modal',
              gestureDirection: 'vertical',
            }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              presentation: 'modal',
              gestureDirection: 'vertical',
            }} 
          />
          <Stack.Screen 
            name="NewEntry" 
            component={NewEntryScreen}
            options={{ 
              presentation: 'modal',
              gestureDirection: 'vertical',
            }} 
          />
          <Stack.Screen 
            name="ChatVoice" 
            component={ChatVoiceScreen}
            options={{ 
              presentation: 'modal',
              gestureDirection: 'vertical',
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalBackground>
  );
}