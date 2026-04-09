import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useAppTheme, Theme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    ...theme.typography.body,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
