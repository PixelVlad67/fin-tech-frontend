import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppTheme, Theme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Logo } from '../../components/atoms/Logo';
import { CustomModal, ModalType } from '../../components/molecules/CustomModal';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

export const RegisterScreen = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { register, isRegistering } = useAuth();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const schema = z.object({
    email: z.string().email(t('email')),
    password: z.string().min(6, t('password')),
    confirmPassword: z.string().min(1, t('confirmPassword')),
    currency: z.string().default('UAH'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('confirmPassword'),
    path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '', currency: 'UAH' }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || t('error');
      setModalConfig({
        visible: true,
        type: 'error',
        title: t('error'),
        message: Array.isArray(serverMessage) ? serverMessage[0] : serverMessage
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft color={theme.colors.text} size={24} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Logo />
          
          <View style={styles.header}>
            <Text style={styles.title}>{t('register')}</Text>
            <Text style={styles.subtitle}>{t('registerSubtitle')}</Text>
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label={t('confirmPassword')} placeholder="******" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.confirmPassword ? t('confirmPassword') : undefined} />
              )}
            />

            <Button label={t('register')} onPress={handleSubmit(onSubmit)} isLoading={isRegistering} style={styles.button} />
            
            <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerText}>{t('alreadyHaveAccount')}<Text style={styles.link}>{t('login')}</Text></Text>
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
  backButton: { padding: 16, position: 'absolute', top: 50, left: 8, zIndex: 10 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center' },
  form: { width: '100%' },
  button: { marginTop: 24, height: 56, borderRadius: 16 },
  footer: { marginTop: 32, alignItems: 'center', marginBottom: 20 },
  footerText: { color: theme.colors.textSecondary, fontSize: 14 },
  link: { color: theme.colors.primary, fontWeight: '700' },
});
