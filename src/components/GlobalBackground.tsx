import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../theme/colors';

export default function GlobalBackground({ children }: { children: React.ReactNode }) {
  const { customBackgroundImage, backgroundTheme } = useStore();
  const colors = useThemeColors();

  if (customBackgroundImage) {
    return (
      <ImageBackground source={{ uri: customBackgroundImage }} style={styles.container} resizeMode="cover">
        <View style={styles.overlay} />
        {children}
      </ImageBackground>
    );
  }

  let gradientColors: [string, string] = [colors.background, colors.backgroundAlt];
  switch (backgroundTheme) {
    case 'forest':  gradientColors = ['#E4F1EE', '#C6E3DB']; break;
    case 'sunset':  gradientColors = ['#FBECE3', '#F5C4A6']; break;
    case 'ocean':   gradientColors = ['#EBF4FA', '#A8D8C8']; break;
    case 'dark':    gradientColors = ['#121212', '#1E1E1E']; break;
    case 'lavender': gradientColors = ['#F0ECF5', '#D4C8E8']; break;
    default:        gradientColors = [colors.background, colors.backgroundAlt]; break;
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  }
});
