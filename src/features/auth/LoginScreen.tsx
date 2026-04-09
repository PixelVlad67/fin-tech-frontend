import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppTheme, Theme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Logo } from '../../components/atoms/Logo';
import { CustomModal, ModalType } from '../../components/molecules/CustomModal';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const schema = z.object({
  email: z.string().email('email'), // Will be translated in UI or here
  password: z.string().min(6, 'password'),
});

type FormData = z.infer<typeof schema>;

export const LoginScreen = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { login, isLoggingIn } = useAuth();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
    } catch (error: any) {
      const msg = error.response?.data?.message || t('error');
      setModalConfig({
        visible: true,
        type: 'error',
        title: t('error'),
        message: Array.isArray(msg) ? msg[0] : msg
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Logo />
          
          <View style={styles.header}>
            <Text style={styles.title}>{t('welcome')}</Text>
            <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label={t('email')} placeholder="example@mail.com" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email ? t('email') : undefined} autoCapitalize="none" />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label={t('password')} placeholder="******" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password ? t('password') : undefined} />
              )}
            />

            <Button label={t('login')} onPress={handleSubmit(onSubmit)} isLoading={isLoggingIn || isSubmitting} style={styles.button} />
            
            <TouchableOpacity 
              style={styles.footer} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.footerText}>
                {t('noAccount')} 
                <Text style={styles.link}>{t('register')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal 
        isVisible={modalConfig.visible}
        onClose={() => setModalConfig(prev => ({ ...prev, visible: false }))}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center' },
  form: { width: '100%' },
  button: { marginTop: 24, height: 56, borderRadius: 16 },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { color: theme.colors.textSecondary, fontSize: 14 },
  link: { color: theme.colors.primary, fontWeight: '700' },
});
