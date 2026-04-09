import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useAnalytics } from '../../hooks/useAnalytics';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react-native';
import Svg, { G, Circle, Rect } from 'react-native-svg';
import { format, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, subMonths } from 'date-fns';

const { width } = Dimensions.get('window');
type Period = 'Day' | 'Week' | 'Month' | 'Quarter' | 'Half-year' | 'Year';

export const AnalyticsScreen = () => {
  const { t, currency } = useTranslation();
  const theme = useAppTheme();
  const [period, setPeriod] = useState<Period>('Month');

  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'Day': startDate = startOfDay(now); break;
      case 'Week': startDate = startOfWeek(now); break;
      case 'Month': startDate = startOfMonth(now); break;
      case 'Quarter': startDate = startOfQuarter(now); break;
      case 'Half-year': startDate = subMonths(now, 6); break;
      case 'Year': startDate = startOfYear(now); break;
      default: startDate = startOfMonth(now);
    }
    return { startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(now, 'yyyy-MM-dd') };
  }, [period]);

  const { useDashboard, useLongTerm, useExpensesByCategory, useTrends } = useAnalytics();
  
  const { data: dashboard, isLoading: dashLoading } = useDashboard();
  const { data: longTerm, isLoading: longLoading } = useLongTerm();
  const { data: expenseResponse, isLoading: expensesLoading } = useExpensesByCategory(dateRange);
  const { data: trends } = useTrends({ period: period === 'Year' ? 'year' : 'month' });

  const currentSpending = useMemo(() => {
    let val = 0;
    switch (period) {
      case 'Day': val = dashboard?.today || 0; break;
      case 'Week': val = dashboard?.weekly || 0; break;
      case 'Month': val = dashboard?.monthly || 0; break;
      case 'Quarter': val = longTerm?.quarterly || 0; break;
      case 'Half-year': val = longTerm?.halfYearly || 0; break;
      case 'Year': val = longTerm?.yearly || 0; break;
    }
    return Number(val);
  }, [period, dashboard, longTerm]);

  const donutData = useMemo(() => {
    const expenses = expenseResponse?.categories;
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) return [];
    
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    let cumulativePercent = 0;

    return expenses.map((item, index) => {
      const percent = Number(item.percentage) || 0;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      
      return {
        ...item,
        percent,
        startPercent,
        color: colors[index % colors.length]
      };
    });
  }, [expenseResponse]);

  const styles = createStyles(theme);

  const renderDonut = () => {
    const size = width * 0.5;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    if (donutData.length === 0) return null;

    return (
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size/2}, ${size/2}`}>
            {donutData.map((item, index) => (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${(item.percent * circumference) / 100} ${circumference}`}
                strokeDashoffset={`${-(item.startPercent * circumference) / 100}`}
                fill="transparent"
              />
            ))}
          </G>
        </Svg>
        <View style={styles.chartCenter}>
          <Text style={styles.centerLabel}>{t('spent')}</Text>
          <Text style={styles.centerValue}>{currency}{currentSpending.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  const renderTrends = () => {
    if (!trends || !Array.isArray(trends) || trends.length === 0) return null;

    const chartHeight = 100;
    const barWidth = 30;
    const gap = 15;
    const chartWidth = Math.max(width - 80, trends.length * (barWidth + gap));
    const maxVal = Math.max(...trends.map(t => Number(t.total) || 0), 1);

    return (
      <View style={styles.trendsContainer}>
        <View style={styles.trendsHeader}>
          <TrendingUp size={18} color={theme.colors.primary} />
          <Text style={styles.trendsTitle}>{t('analytics')} (Trends)</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendsScroll}>
          <View>
            <Svg width={chartWidth} height={chartHeight}>
              {trends.map((item, index) => {
                const val = Number(item.total) || 0;
                const h = (val / maxVal) * (chartHeight - 20);
                const x = index * (barWidth + gap);
                return (
                  <Rect
                    key={index}
                    x={x}
                    y={chartHeight - h - 20}
                    width={barWidth}
                    height={h}
                    fill={theme.colors.primary}
                    rx={6}
                    opacity={0.8}
                  />
                );
              })}
            </Svg>
            <View style={{ flexDirection: 'row', width: chartWidth }}>
              {trends.map((item, index) => {
                const parts = item.date.split('-');
                const label = period === 'Year' ? parts[1] : parts[2] || parts[0];
                return (
                  <Text key={index} style={[styles.trendLabel, { width: barWidth, marginLeft: index === 0 ? 0 : gap }]}>
                    {label}
                  </Text>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const periods: Period[] = ['Day', 'Week', 'Month', 'Quarter', 'Half-year', 'Year'];

  if (dashLoading || longLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('analytics')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodSelector}>
          {periods.map((p) => (
            <TouchableOpacity 
              key={p} 
              style={[styles.periodButton, period === p && styles.activePeriodButton]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.activePeriodText]}>{t(p.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          {expensesLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ padding: 40 }} />
          ) : donutData.length > 0 ? (
            <>
              {renderDonut()}
              <View style={styles.legendGrid}>
                {donutData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText} numberOfLines={1}>{t(item.category)}</Text>
                    <Text style={styles.legendPercent}>{Math.round(item.percent)}%</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <PieIcon size={48} color={theme.colors.border} />
              <Text style={styles.emptyText}>{t('noData')}</Text>
            </View>
          )}
        </View>

        {renderTrends()}

        {donutData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t('breakdown')}</Text>
            <View style={styles.breakdownList}>
              {donutData.map((item, index) => (
                <View key={index} style={styles.barItem}>
                  <View style={styles.barHeader}>
                    <View style={styles.barLabelWrapper}>
                      <View style={[styles.smallDot, { backgroundColor: item.color }]} />
                      <Text style={styles.barLabel}>{t(item.category)}</Text>
                    </View>
                    <Text style={styles.barValue}>{currency}{Number(item.total).toLocaleString()}</Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          width: `${item.percent}%`,
                          backgroundColor: item.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { backgroundColor: theme.colors.card, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  title: { fontSize: 28, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16, color: theme.colors.text },
  periodSelector: { paddingHorizontal: 20 },
  periodButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 22, marginRight: 10, backgroundColor: theme.isDark ? theme.colors.border : '#f1f5f9' },
  activePeriodButton: { backgroundColor: theme.colors.primary },
  periodText: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary },
  activePeriodText: { color: '#fff' },
  scrollContent: { padding: 20 },
  mainCard: { backgroundColor: theme.colors.card, borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
  chartWrapper: { position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  chartCenter: { position: 'absolute', alignItems: 'center' },
  centerLabel: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600' },
  centerValue: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.isDark ? theme.colors.background : '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, minWidth: '45%' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 12, fontWeight: '600', color: theme.colors.text, flex: 1 },
  legendPercent: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginLeft: 4 },
  trendsContainer: { backgroundColor: theme.colors.card, borderRadius: 32, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
  trendsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  trendsTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  trendsScroll: { marginHorizontal: -5 },
  trendLabel: { fontSize: 10, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 4, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16, color: theme.colors.text },
  breakdownList: { backgroundColor: theme.colors.card, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 30 },
  barItem: { marginBottom: 20 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  barLabelWrapper: { flexDirection: 'row', alignItems: 'center' },
  smallDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  barLabel: { fontSize: 15, color: theme.colors.text, fontWeight: '600' },
  barValue: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  barBackground: { height: 10, backgroundColor: theme.isDark ? theme.colors.border : '#f1f5f9', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: theme.colors.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 12 },
});
