import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback
} from 'react-native';
import { useAppTheme, Theme } from '../../theme';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react-native';

export type ModalType = 'success' | 'error' | 'confirm' | 'info';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({ 
  isVisible, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info',
  confirmText,
  cancelText
}) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={48} color={theme.colors.success} />;
      case 'error': return <XCircle size={48} color={theme.colors.error} />;
      case 'confirm': return <AlertTriangle size={48} color={theme.colors.warning} />;
      default: return <Info size={48} color={theme.colors.primary} />;
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={type === 'confirm' ? undefined : onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.iconWrapper}>{getIcon()}</View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              <View style={styles.buttonRow}>
                {type === 'confirm' && (
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText || 'Cancel'}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.confirmButton, 
                    type === 'error' && { backgroundColor: theme.colors.error }
                  ]} 
                  onPress={onConfirm || onClose}
                >
                  <Text style={styles.confirmButtonText}>
                    {confirmText || (type === 'confirm' ? 'Confirm' : 'OK')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  container: { 
    backgroundColor: theme.colors.card, 
    borderRadius: 32, 
    padding: 32, 
    width: '100%', 
    alignItems: 'center', 
    elevation: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 20 
  },
  iconWrapper: { marginBottom: 20 },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: theme.colors.text, 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  message: { 
    fontSize: 16, 
    color: theme.colors.textSecondary, 
    textAlign: 'center', 
    lineHeight: 22, 
    marginBottom: 32 
  },
  buttonRow: { flexDirection: 'row', gap: 12, width: '100%' },
  button: { 
    flex: 1, 
    height: 56, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: theme.isDark ? theme.colors.border : '#f1f5f9' 
  },
  confirmButton: { backgroundColor: theme.colors.primary },
  cancelButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: theme.colors.textSecondary 
  },
  confirmButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
