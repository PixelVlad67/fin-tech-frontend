import { useAuthStore } from '../store/useAuthStore';

const translations = {
  en: {
    // Auth
    welcome: 'Welcome back!',
    loginSubtitle: 'Login to manage your finances',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    login: 'Login',
    noAccount: "Don't have an account? ",
    register: 'Register',
    logout: 'Logout',
    alreadyHaveAccount: 'Already have an account? ',
    registerSubtitle: 'Create an account to start tracking',
    
    // Months
    m1: 'January', m2: 'February', m3: 'March', m4: 'April', m5: 'May', m6: 'June',
    m7: 'July', m8: 'August', m9: 'September', m10: 'October', m11: 'November', m12: 'December',

    // Dashboard
    totalBalance: 'Total Balance',
    monthlyRemaining: 'Monthly Remaining',
    income: 'Income',
    expense: 'Expense',
    spent: 'Spent',
    transfer: 'Transfer',
    setBudget: 'Set Monthly Budget',
    editBudget: 'Edit Budget',
    budget: 'Budget',
    history: 'History',
    viewAll: 'View All',
    noTransactions: 'No transactions yet',
    todaySpending: "Today's Spending",
    monthlySpent: 'Monthly Spent',
    
    // Analytics
    analytics: 'Analytics',
    totalSpent: 'Total Spent',
    breakdown: 'Expense Breakdown',
    netFlow: 'Net Flow',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    halfYear: 'Half Year',
    quarter: 'Quarter',
    year: 'Year',
    noData: 'No data for this period',
    
    // Transactions / Expenses
    addExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    amount: 'Amount',
    description: 'Description',
    selectCategory: 'Select Category',
    saveChanges: 'Save Changes',
    deleteExpense: 'Delete Expense',
    deleteConfirm: 'Are you sure you want to delete this?',
    expenseSaved: 'Expense saved successfully',
    budgetUpdated: 'Monthly budget updated',
    noCategories: 'No categories found',
    createDefaultCategories: 'Create Default Categories',
    categoriesCreated: 'Categories created successfully',
    
    // Categories Mapping
    'food': 'Food',
    'transport': 'Transport',
    'home': 'Home',
    'entertainment': 'Entertainment',
    'health': 'Health',
    'shopping': 'Shopping',
    'utilities': 'Utilities',
    'coffee': 'Coffee',
    'other': 'Other',
    'salary': 'Salary',
    'продукти': 'Food',
    'транспорт': 'Transport',
    'житло': 'Home',
    'розваги': 'Entertainment',
    'здоров’я': 'Health',
    'шопінг': 'Shopping',
    'комуналка': 'Utilities',
    'кава': 'Coffee',
    'інше': 'Other',

    // Profile
    profile: 'Profile',
    language: 'Language',
    appSettings: 'App Settings',
    dangerZone: 'Danger Zone',
    
    // Common Actions
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    success: 'Success',
    error: 'Error',
  },
  ua: {
    // Auth
    welcome: 'З поверненням!',
    loginSubtitle: 'Увійдіть, щоб керувати фінансами',
    email: 'Електронна пошта',
    password: 'Пароль',
    confirmPassword: 'Підтвердіть пароль',
    login: 'Увійти',
    noAccount: 'Немає акаунту? ',
    register: 'Реєстрація',
    logout: 'Вийти',
    alreadyHaveAccount: 'Вже є акаунт? ',
    registerSubtitle: 'Створіть акаунт, щоб почати облік',

    // Months
    m1: 'Січень', m2: 'Лютий', m3: 'Березень', m4: 'Квітень', m5: 'Травень', m6: 'Червень',
    m7: 'Липень', m8: 'Серпень', m9: 'Вересень', m10: 'Жовтень', m11: 'Листопад', m12: 'Грудень',
    
    // Dashboard
    totalBalance: 'Загальний баланс',
    monthlyRemaining: 'Залишок на місяць',
    income: 'Дохід',
    expense: 'Витрати',
    spent: 'Витрачено',
    transfer: 'Переказ',
    setBudget: 'Встановити бюджет',
    editBudget: 'Змінити бюджет',
    budget: 'Бюджет',
    history: 'Історія',
    viewAll: 'Всі',
    noTransactions: 'Транзакцій поки немає',
    todaySpending: 'Витрати за сьогодні',
    monthlySpent: 'Витрати за місяць',
    
    // Analytics
    analytics: 'Аналітика',
    totalSpent: 'Всього витрат',
    breakdown: 'Деталізація витрат',
    netFlow: 'Чистий потік',
    day: 'День',
    week: 'Тиждень',
    month: 'Місяць',
    halfYear: 'Пів року',
    quarter: 'Квартал',
    year: 'Рік',
    noData: 'Немає даних за цей період',
    
    // Transactions / Expenses
    addExpense: 'Нова витрата',
    editExpense: 'Редагувати витрату',
    amount: 'Сума',
    description: 'Опис',
    selectCategory: 'Оберіть категорію',
    saveChanges: 'Зберегти зміни',
    deleteExpense: 'Видалити витрату',
    deleteConfirm: 'Ви впевнені, що хочете видалити це?',
    expenseSaved: 'Витрату успішно збережено',
    budgetUpdated: 'Місячний бюджет оновлено',
    noCategories: 'Категорій поки немає',
    createDefaultCategories: 'Створити стандартні',
    categoriesCreated: 'Категорії успішно створено',

    // Categories Mapping
    'food': 'Продукти',
    'transport': 'Транспорт',
    'home': 'Житло',
    'entertainment': 'Розваги',
    'health': 'Здоров’я',
    'shopping': 'Шопінг',
    'utilities': 'Комуналка',
    'coffee': 'Кава',
    'other': 'Інше',
    'salary': 'Зарплата',
    'продукти': 'Продукти',
    'транспорт': 'Транспорт',
    'житло': 'Житло',
    'розваги': 'Розваги',
    'здоров’я': 'Здоров’я',
    'шопінг': 'Шопінг',
    'комуналка': 'Комуналка',
    'кава': 'Кава',
    'інше': 'Інше',
    
    // Profile
    profile: 'Профіль',
    language: 'Мова',
    appSettings: 'Налаштування',
    dangerZone: 'Небезпечна зона',
    
    // Common Actions
    save: 'Зберегти',
    edit: 'Редагувати',
    delete: 'Видалити',
    cancel: 'Скасувати',
    yes: 'Так',
    no: 'Ні',
    all: 'Всі',
    success: 'Успішно',
    error: 'Помилка',
  }
};

export const useTranslation = () => {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  
  const t = (key: string) => {
    if (!key) return '';
    
    const dict = translations[language] as any;
    
    // 1. Спершу пробуємо точний ключ (для UI елементів: monthlyRemaining тощо)
    if (dict[key]) return dict[key];
    
    // 2. Якщо не знайдено, пробуємо в нижньому регістрі (для категорій з бази)
    const lowerKey = key.toLowerCase().trim();
    if (dict[lowerKey]) return dict[lowerKey];
    
    // 3. Якщо нічого не знайшли — повертаємо оригінал
    return key;
  };
  
  return {
    t,
    language,
    setLanguage,
    currency: '₴'
  };
};
