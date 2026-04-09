import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { useAppTheme, Theme } from '../../theme';

interface LogoProps {
  size?: 'small' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ size = 'large' }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isLarge = size === 'large';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
  }, [fadeAnim, scaleAnim]);
  
  return (
    <Animated.View style={[
      styles.container, 
      isLarge ? styles.containerLarge : styles.containerSmall,
      { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
    ]}>
      <View style={[styles.iconWrapper, isLarge ? styles.iconLarge : styles.iconSmall]}>
        <Wallet color="#fff" size={isLarge ? 40 : 20} strokeWidth={2.5} />
      </View>
      <View>
        <Text style={[styles.text, isLarge ? styles.textLarge : styles.textSmall]}>
          Fin<Text style={{ color: theme.colors.primary }}>Tech</Text>
        </Text>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  containerLarge: { marginBottom: 40 },
  containerSmall: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconWrapper: {
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  iconLarge: { width: 80, height: 80, marginBottom: 16 },
  iconSmall: { width: 36, height: 36 },
  text: { fontWeight: '900', letterSpacing: -0.5 },
  textLarge: { fontSize: 32, color: theme.colors.text },
  textSmall: { fontSize: 18, color: theme.colors.text },
});
