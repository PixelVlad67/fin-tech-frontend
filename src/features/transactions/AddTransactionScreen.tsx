import React, { useEffect, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppTheme, Theme } from '../../theme';
import { useTranslation } from '../../theme/i18n';
import { useCategories } from '../../hooks/useCategories';
import { useTransactions } from '../../hooks/useTransactions';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { CustomModal, ModalType } from '../../components/molecules/CustomModal';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Trash2, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Film, 
  HeartPulse, 
  Zap, 
  Smartphone, 
  GraduationCap, 
  Gift, 
  Dumbbell, 
  Coffee,
  MoreHorizontal,
  Plus
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 60) / COLUMN_COUNT;

const getCategoryIcon = (iconName: string, size = 24, color: string) => {
  const icons: Record<string, any> = {
    'utensils': Utensils, 'car': Car, 'shopping-bag': ShoppingBag,
    'home': Home, 'film': Film, 'heart-pulse': HeartPulse,
    'zap': Zap, 'smartphone': Smartphone, 'graduation-cap': GraduationCap,
    'gift': Gift, 'dumbbell': Dumbbell, 'coffee': Coffee,
    'food': Utensils, 'transport': Car, 'entertainment': Film,
    'health': HeartPulse, 'utilities': Zap, 'bills': Zap,
    'shopping': ShoppingBag, 'education': GraduationCap,
  };
  const IconComponent = icons[iconName.toLowerCase()] || MoreHorizontal;
  return <IconComponent size={size} color={color} />;
};

type AddTransactionRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;

export const AddTransactionScreen = () => {
  const { t, currency } = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute<AddTransactionRouteProp>();
  const editingTransaction = route.params?.transaction;
  const isEditing = !!editingTransaction;
  
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  const { useAllCategories, createCategory } = useCategories();
  const { createTransaction, updateTransaction, deleteTransaction, isCreating } = useTransactions();
  const { data: allCategories, isLoading: categoriesLoading, refetch: refetchCategories } = useAllCategories();
  
  const categories = useMemo(() => allCategories?.filter(c => c.type === 'expense') || [], [allCategories]);

  const schema = useMemo(() => z.object({
    amount: z.string().transform((val) => parseFloat(val)).pipe(z.number().positive(t('amount'))),
    description: z.string().min(1, t('description')),
    categoryId: z.string().min(1, t('selectCategory')),
  }), [t]);

  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: editingTransaction ? Math.abs(editingTransaction.amount).toString() : undefined,
      description: editingTransaction?.description || '',
      categoryId: editingTransaction?.categoryId || '',
    } as any
  });

  const selectedCategoryId = watch('categoryId');

  const handleCreateDefaults = async () => {
    const DEFAULT_CATEGORIES = [
      { name: 'food', icon: 'food', type: 'expense' },
      { name: 'transport', icon: 'transport', type: 'expense' },
      { name: 'home', icon: 'home', type: 'expense' },
      { name: 'entertainment', icon: 'entertainment', type: 'expense' },
      { name: 'health', icon: 'health', type: 'expense' },
      { name: 'shopping', icon: 'shopping', type: 'expense' },
      { name: 'utilities', icon: 'utilities', type: 'expense' },
      { name: 'coffee', icon: 'coffee', type: 'expense' },
      { name: 'other', icon: 'other', type: 'expense' },
    ];
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        await createCategory(cat as any);
      }
      refetchCategories();
      setModalConfig({
        visible: true,
        type: 'success',
        title: t('success'),
        message: t('categoriesCreated')
      });
    } catch (e) {
      setModalConfig({ visible: true, type: 'error', title: t('error'), message: t('error') });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { amount: data.amount, description: data.description, categoryId: data.categoryId };
      if (isEditing) {
        await (updateTransaction as any)({ id: editingTransaction.id, data: payload });
      } else {
        await createTransaction(payload);
      }
      navigation.goBack();
    } catch (error: any) {
      setModalConfig({ visible: true, type: 'error', title: t('error'), message: t('error') });
    }
  };

  const handleDelete = () => {
    setModalConfig({
      visible: true,
      type: 'confirm',
      title: t('delete'),
      message: t('deleteConfirm'),
      onConfirm: async () => {
        await (deleteTransaction as any)(editingTransaction!.id);
        setModalConfig(null);
        navigation.goBack();
      }
    });
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEditing ? t('editExpense') : t('addExpense')}</Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleDelete}><Trash2 color={theme.colors.error} size={24} /></TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>{currency}</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="0" keyboardType="numeric" value={value?.toString()} onChangeText={onChange} error={errors.amount?.message} style={styles.amountInput} autoFocus />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('selectCategory')}</Text>
          {categoriesLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
          ) : categories.length > 0 ? (
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;
                return (
                  <TouchableOpacity key={category.id} style={[styles.categoryItem, isSelected && styles.categoryItemActive]} onPress={() => setValue('categoryId', category.id)}>
                    <View style={[styles.iconContainer, isSelected ? styles.iconContainerActive : styles.iconContainerInactive]}>
                      {getCategoryIcon(category.icon || category.name, 24, isSelected ? '#fff' : theme.colors.text)}
                    </View>
                    <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]} numberOfLines={1}>{t(category.name)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyCategories}>
              <Text style={styles.emptyText}>{t('noCategories')}</Text>
              <TouchableOpacity style={styles.seedButton} onPress={handleCreateDefaults}>
                <Plus size={18} color="#fff" /><Text style={styles.seedButtonText}>{t('createDefaultCategories')}</Text>
              </TouchableOpacity>
            </View>
          )}
          {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('description')}</Text>
          <Controller control={control} name="description" render={({ field: { onChange, value } }) => (
            <Input placeholder={t('description') + "..."} value={value} onChangeText={onChange} error={errors.description?.message} />
          )} />
        </View>

        <Button label={isEditing ? t('saveChanges') : t('addExpense')} onPress={handleSubmit(onSubmit)} isLoading={isCreating} style={styles.submitButton} />
      </ScrollView>

      {modalConfig && (
        <CustomModal 
          isVisible={modalConfig.visible}
          onClose={() => setModalConfig(null)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          confirmText={modalConfig.type === 'confirm' ? t('delete') : t('save')}
          cancelText={t('cancel')}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.card },
  backButton: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  scrollContent: { padding: 20 },
  amountSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32, height: 100 },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: theme.colors.text, marginRight: 8, marginTop: -15 },
  amountInput: { fontSize: 48, textAlign: 'left', borderBottomWidth: 0, fontWeight: '800', height: 80, width: 200, backgroundColor: 'transparent', color: theme.colors.text },
  section: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  categoryItem: { width: ITEM_SIZE, alignItems: 'center', marginBottom: 16, padding: 8, borderRadius: 16, marginHorizontal: 5 },
  categoryItemActive: { backgroundColor: theme.isDark ? '#312e81' : '#eff6ff' },
  iconContainer: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  iconContainerInactive: { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
  iconContainerActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  categoryName: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  categoryNameActive: { color: theme.colors.primary, fontWeight: '700' },
  submitButton: { marginTop: 10, borderRadius: 20, height: 56 },
  errorText: { color: theme.colors.error, fontSize: 12, marginTop: 8 },
  emptyCategories: { alignItems: 'center', padding: 20, backgroundColor: theme.colors.card, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed' },
  emptyText: { color: theme.colors.textSecondary, marginBottom: 12 },
  seedButton: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  seedButtonText: { color: '#fff', fontWeight: '600', marginLeft: 8 },
});
