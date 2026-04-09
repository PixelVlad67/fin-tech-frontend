import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme, Theme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useTransactions } from '../../hooks/useTransactions';
import { useAnalytics } from '../../hooks/useAnalytics';
import { TransactionItem } from '../../components/molecules/TransactionItem';
import { SetBudgetModal } from './SetBudgetModal';
import { Logo } from '../../components/atoms/Logo';
import { ArrowDownLeft, ChevronLeft, ChevronRight, Settings2, AlertCircle } from 'lucide-react-native';
import { format, addMonths } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';

export const DashboardScreen = () => {
  const { t, currency, language } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);

  const currentLocale = language === 'ua' ? uk : enUS;

  const { useTransactionHistory } = useTransactions();
  const { useDashboard } = useAnalytics();
  
  const { data: transactions, isLoading: transactionsLoading } = useTransactionHistory();
  const { data: dashboard } = useDashboard();

  const budget = dashboard?.budget || 0;
  const remaining = dashboard?.remaining || 0;
  const progress = budget > 0 ? (dashboard!.monthly / budget) : 0;
  const isOverBudget = dashboard?.overBudget || false;

  const formattedMonth = t(`m${selectedDate.getMonth() + 1}` as any) + ' ' + selectedDate.getFullYear();

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.topHeader}>
        <Logo size="small" />
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => setSelectedDate(prev => addMonths(prev, -1))}><ChevronLeft color={theme.colors.text} size={24} /></TouchableOpacity>
        <Text style={styles.monthTitle}>{format(selectedDate, 'LLLL yyyy', { locale: currentLocale })}</Text>
        <TouchableOpacity onPress={() => setSelectedDate(prev => addMonths(prev, 1))}><ChevronRight color={theme.colors.text} size={24} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.budgetCard, isOverBudget && styles.budgetCardOver]}>
          <View style={styles.budgetHeader}>
            <Text style={[styles.budgetLabel, isOverBudget && styles.textWhite]}>{t('monthlyRemaining')}</Text>
            <TouchableOpacity style={styles.budgetSettings} onPress={() => setIsBudgetModalVisible(true)}>
              <Settings2 color={isOverBudget ? '#fff' : theme.colors.textSecondary} size={14} />
              <Text style={[styles.budgetSettingsText, isOverBudget && styles.textWhite]}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountRow}>
            <Text style={[styles.budgetValue, isOverBudget && styles.textWhite]}>
              {currency}{remaining.toLocaleString()}
            </Text>
            {isOverBudget && <AlertCircle color="#fff" size={24} style={{ marginLeft: 10 }} />}
          </View>

          <View style={[styles.progressContainer, isOverBudget && styles.progressContainerOver]}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${Math.min(progress * 100, 100)}%`, 
                backgroundColor: isOverBudget ? '#fff' : theme.colors.primary 
              }
            ]} />
          </View>

          <View style={styles.budgetStats}>
            <View>
              <Text style={[styles.statLabel, isOverBudget && styles.textWhiteOpacity]}>{t('budget')}</Text>
              <Text style={[styles.statValue, { color: isOverBudget ? '#fff' : theme.colors.success }]}>{currency}{budget.toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.statLabel, isOverBudget && styles.textWhiteOpacity]}>{t('spent')}</Text>
              <Text style={[styles.statValue, { color: isOverBudget ? '#fff' : theme.colors.error }]}>-{currency}{dashboard?.monthly?.toLocaleString() || '0'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t('todaySpending')}</Text>
            <Text style={styles.infoValue}>{currency}{dashboard?.today?.toLocaleString() || '0'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Daily Average</Text>
            <Text style={styles.infoValue}>{currency}{dashboard?.dailyAverage?.toLocaleString() || '0'}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { width: '100%' }]} 
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}><ArrowDownLeft size={24} color={theme.colors.error} /></View>
            <Text style={styles.actionText}>{t('addExpense')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('history')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}><Text style={styles.seeAllText}>{t('viewAll')}</Text></TouchableOpacity>
        </View>
        
        <View style={styles.transactionsContainer}>
          {transactionsLoading ? <ActivityIndicator style={{ padding: 20 }} /> : (transactions && transactions.length > 0) ? (
            transactions.slice(0, 10).map((transaction) => (
              <TouchableOpacity key={transaction.id} onPress={() => navigation.navigate('AddTransaction', { transaction })}><TransactionItem transaction={transaction} /></TouchableOpacity>
            ))
          ) : <Text style={styles.emptyText}>{t('noTransactions')}</Text>}
        </View>
      </ScrollView>

      <SetBudgetModal 
        isVisible={isBudgetModalVisible} 
        onClose={() => setIsBudgetModalVisible(false)} 
        currentDate={selectedDate}
        initialAmount={dashboard?.budget}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topHeader: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: theme.colors.background },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: theme.colors.card },
  monthTitle: { fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: theme.colors.text },
  budgetCard: { margin: 20, padding: 24, backgroundColor: theme.colors.card, borderRadius: 32, borderWidth: 1, borderColor: theme.colors.border },
  budgetCardOver: { backgroundColor: theme.colors.error, borderColor: theme.colors.error },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  budgetSettings: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  budgetSettingsText: { fontSize: 11, color: theme.colors.textSecondary, marginLeft: 4, fontWeight: '600' },
  budgetLabel: { fontSize: 13, color: theme.colors.textSecondary },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  budgetValue: { fontSize: 32, fontWeight: '800', color: theme.colors.text },
  textWhite: { color: '#fff' },
  textWhiteOpacity: { color: 'rgba(255,255,255,0.7)' },
  progressContainer: { height: 6, backgroundColor: theme.isDark ? theme.colors.border : '#f1f5f9', borderRadius: 3, marginVertical: 20, overflow: 'hidden' },
  progressContainerOver: { backgroundColor: 'rgba(255,255,255,0.3)' },
  progressBar: { height: '100%' },
  budgetStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary },
  statValue: { fontSize: 15, fontWeight: '700' },
  infoRow: { flexDirection: 'row', marginHorizontal: 20, gap: 15, marginBottom: 20 },
  infoBox: { flex: 1, padding: 20, backgroundColor: theme.colors.card, borderRadius: 24, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  infoLabel: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4, fontWeight: '600' },
  infoValue: { color: theme.colors.text, fontSize: 20, fontWeight: '800' },
  quickActions: { paddingHorizontal: 20, marginBottom: 24 },
  actionButton: { alignItems: 'center', backgroundColor: theme.colors.card, padding: 16, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
  actionIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionText: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  seeAllText: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  transactionsContainer: { marginHorizontal: 20, backgroundColor: theme.colors.card, borderRadius: 24, paddingHorizontal: 16, paddingBottom: 8, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 30 },
  emptyText: { textAlign: 'center', paddingVertical: 30, color: theme.colors.textSecondary, fontSize: 13 },
});
