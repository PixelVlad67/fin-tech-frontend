import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { TransactionItem } from '../../components/molecules/TransactionItem';
import { useNavigation } from '@react-navigation/native';

export const TransactionsScreen = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<any>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  
  const { useTransactionHistory } = useTransactions();
  const { useAllCategories } = useCategories();
  
  const { data: categories } = useAllCategories();
  const { data: transactions, isLoading } = useTransactionHistory({ categoryId: selectedCategoryId });

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('history')}</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, !selectedCategoryId && styles.activeChip]}
            onPress={() => setSelectedCategoryId(undefined)}
          >
            <Text style={[styles.filterText, !selectedCategoryId && styles.activeFilterText]}>{t('all')}</Text>
          </TouchableOpacity>
          {categories?.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.filterChip, selectedCategoryId === cat.id && styles.activeChip]}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text style={[styles.filterText, selectedCategoryId === cat.id && styles.activeFilterText]}>
                {t(cat.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
              style={styles.itemWrapper}
            >
              <TransactionItem transaction={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('noTransactions')}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 20, backgroundColor: theme.colors.card },
  title: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  filterContainer: { backgroundColor: theme.colors.card, paddingBottom: 12 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.isDark ? theme.colors.border : '#f1f5f9', marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  activeChip: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  activeFilterText: { color: '#fff' },
  listContent: { padding: 20 },
  itemWrapper: { marginBottom: 4 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: theme.colors.textSecondary, fontSize: 16 },
});
