import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { useAppTheme, Theme } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  isLoading,
  style,
  disabled,
  ...props
}) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.colors.textSecondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'danger':
        return { backgroundColor: theme.colors.error };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const getLabelStyle = () => {
    if (variant === 'outline') {
      return { color: theme.colors.primary };
    }
    return { color: '#ffffff' };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#ffffff'} />
      ) : (
        <Text style={[styles.label, getLabelStyle()]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  button: {
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  label: {
    ...theme.typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
});
