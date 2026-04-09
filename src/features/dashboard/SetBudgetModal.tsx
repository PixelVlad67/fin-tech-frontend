import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppTheme, Theme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { CustomModal, ModalType } from '../../components/molecules/CustomModal';
import { useTransactions } from '../../hooks/useTransactions';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';

interface SetBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentDate: Date;
  initialAmount?: number;
}

export const SetBudgetModal = ({ isVisible, onClose, currentDate, initialAmount }: SetBudgetModalProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation();
  const [amount, setAmount] = useState(initialAmount?.toString() || '');
  const { setBudget, isSettingBudget } = useTransactions();
  const queryClient = useQueryClient();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    onClose?: () => void;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setModalConfig({
        visible: true,
        type: 'error',
        title: t('error'),
        message: t('amount')
      });
      return;
    }

    try {
      await setBudget({
        amount: numericAmount,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });

      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      
      setModalConfig({
        visible: true,
        type: 'success',
        title: t('success'),
        message: t('budgetUpdated'),
        onClose: () => {
          setModalConfig(prev => ({ ...prev, visible: false }));
          onClose();
        }
      });
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      setModalConfig({
        visible: true,
        type: 'error',
        title: t('error'),
        message: Array.isArray(serverMessage) ? serverMessage[0] : (serverMessage || t('error'))
      });
    }
  };

  return (
    <View style={{ position: 'absolute' }}>
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
              >
                <View style={styles.header}>
                  <Text style={styles.title}>{t('setBudget')}</Text>
                  <TouchableOpacity onPress={onClose}>
                    <X color={theme.colors.text} size={24} />
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <Text style={styles.label}>{t('amount')}</Text>
                  <Input 
                    placeholder="0.00" 
                    keyboardType="numeric" 
                    value={amount} 
                    onChangeText={setAmount} 
                    autoFocus 
                    style={styles.input}
                    textAlign="center"
                  />
                  
                  <Button 
                    label={t('save')} 
                    onPress={handleSave} 
                    isLoading={isSettingBudget} 
                    style={styles.button}
                  />
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CustomModal 
        isVisible={modalConfig.visible}
        onClose={modalConfig.onClose || (() => setModalConfig(prev => ({ ...prev, visible: false })))}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  container: { 
    backgroundColor: theme.colors.card, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24, 
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: theme.colors.text 
  },
  content: {},
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: theme.colors.textSecondary, 
    marginBottom: 8 
  },
  input: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: theme.colors.text 
  },
  button: { marginTop: 24 },
});
