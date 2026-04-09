import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme, Theme } from '../../theme';
import { Transaction } from '../../types/api';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { useTranslation } from '../../theme/i18n';
import { format, parseISO, isValid } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { t, currency, language } = useTranslation();
  const isExpense = transaction.amount < 0 || (transaction.category?.type === 'expense');
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = parseISO(dateStr);
    if (!isValid(date)) return '';
    return format(date, 'dd MMM yyyy', { locale: language === 'ua' ? uk : enUS });
  };

  const iconBgColor = isExpense 
    ? (theme.isDark ? '#452a2a' : '#fee2e2') 
    : (theme.isDark ? '#1a2e25' : '#dcfce7');

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: iconBgColor }
      ]}>
        {isExpense ? (
          <TrendingDown size={20} color={theme.colors.error} />
        ) : (
          <TrendingUp size={20} color={theme.colors.success} />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.categoryName}>
          {transaction.category?.name ? t(transaction.category.name) : t('all')}
        </Text>
        <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount,
          { color: isExpense ? theme.colors.error : theme.colors.success }
        ]}>
          {isExpense ? '-' : '+'}{currency}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.date}>
          {formatDate(transaction.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: theme.spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border 
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: theme.borderRadius.md, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: theme.spacing.md 
  },
  content: { flex: 1 },
  categoryName: { 
    fontSize: theme.typography.body.fontSize, 
    fontWeight: '600', 
    color: theme.colors.text, 
    marginBottom: 2 
  },
  description: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.textSecondary 
  },
  amountContainer: { alignItems: 'flex-end' },
  amount: { 
    fontSize: theme.typography.body.fontSize, 
    fontWeight: '700', 
    marginBottom: 2 
  },
  date: { fontSize: 12, color: theme.colors.textSecondary },
});
