export interface User {
  id: string;
  email: string;
  name?: string;
  currency?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password?: string;
  currency?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  userId?: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  createdAt: string;
  category?: Category;
}

export interface CreateTransactionDto {
  categoryId: string;
  amount: number;
  description: string;
}

export interface UpdateTransactionDto {
  categoryId?: string;
  amount?: number;
  description?: string;
}

export interface SetBudgetDto {
  amount: number;
  month: number;
  year: number;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  userId: string;
}

export interface CategoryExpense {
  category: string;
  total: number;
  percentage: number;
}

export interface ExpensesByCategoryResponse {
  totalPeriodSpent: number;
  categories: CategoryExpense[];
}

export interface DashboardStats {
  today: number;
  weekly: number;
  monthly: number;
  budget: number;
  remaining: number;
  dailyAverage: number;
  overBudget: boolean;
}

export interface LongTermStats {
  quarterly: number;
  halfYearly: number;
  yearly: number;
}

export interface TrendData {
  date: string;
  total: number;
  breakdown?: {
    category: string;
    total: number;
  }[];
}
