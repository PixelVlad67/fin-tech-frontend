import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import { CustomModal, ModalType } from '../../components/molecules/CustomModal';
import { LogOut, Globe, Shield, User as UserIcon, ChevronRight, Moon, Sun } from 'lucide-react-native';

export const ProfileScreen = () => {
  const { t, language, setLanguage } = useTranslation();
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const themeMode = useAuthStore((state) => state.themeMode);
  const setThemeMode = useAuthStore((state) => state.setThemeMode);
  const { logout } = useAuth();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  const handleLogout = () => {
    setModalConfig({
      visible: true,
      type: 'confirm',
      title: t('logout'),
      message: language === 'ua' ? 'Ви впевнені, що хочете вийти з акаунту?' : 'Are you sure you want to log out?',
      onConfirm: async () => {
        setModalConfig(null);
        await logout();
      }
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ua' ? 'en' : 'ua');
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <UserIcon color="#fff" size={32} />
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appSettings')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.isDark ? '#312e81' : '#e0e7ff' }]}>
                <Globe size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.settingText}>{t('language')}</Text>
            </View>
            <View style={styles.languageSwitch}>
              <Text style={[styles.langLabel, language === 'ua' && styles.activeLang]}>UA</Text>
              <Switch 
                value={language === 'en'} 
                onValueChange={toggleLanguage}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#fff"
              />
              <Text style={[styles.langLabel, language === 'en' && styles.activeLang]}>EN</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.isDark ? '#374151' : '#f1f5f9' }]}>
                {theme.isDark ? <Moon size={20} color={theme.colors.primary} /> : <Sun size={20} color={theme.colors.warning} />}
              </View>
              <Text style={styles.settingText}>{language === 'ua' ? 'Темна тема' : 'Dark Mode'}</Text>
            </View>
            <Switch 
              value={theme.isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.isDark ? '#451a03' : '#fef3c7' }]}>
                <Shield size={20} color={theme.isDark ? '#fbbf24' : '#d97706'} />
              </View>
              <Text style={styles.settingText}>{t('appSettings')}</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>{t('dangerZone')}</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLabel}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.isDark ? '#450a0a' : '#fee2e2' }]}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              <Text style={[styles.settingText, { color: theme.colors.error }]}>{t('logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {modalConfig && (
        <CustomModal 
          isVisible={modalConfig.visible}
          onClose={() => setModalConfig(null)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          confirmText={t('yes')}
          cancelText={t('no')}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.card },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  scrollContent: { padding: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userName: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: theme.colors.textSecondary },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.card, padding: 16, borderRadius: 20, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border },
  settingLabel: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  languageSwitch: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  activeLang: { color: theme.colors.primary },
});
