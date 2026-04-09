import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/useAuthStore';
import { useAppTheme } from '../theme';
import { Home, PieChart, User, Activity } from 'lucide-react-native';
import { View, ActivityIndicator } from 'react-native';

import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen } from '../features/auth/RegisterScreen';
import { Transaction } from '../types/api';

import { DashboardScreen } from '../features/dashboard/DashboardScreen';
import { AnalyticsScreen } from '../features/analytics/AnalyticsScreen';
import { AddTransactionScreen } from '../features/transactions/AddTransactionScreen';
import { TransactionsScreen } from '../features/transactions/TransactionsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
  AddTransaction: { type?: 'income' | 'expense', transaction?: Transaction, isSalary?: boolean } | undefined;
  Auth: undefined;
  History: undefined;
};

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  const theme = useAppTheme();
  return (
    <AuthStack.Navigator screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: theme.colors.background }
    }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const TabNavigator = () => {
  const theme = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="History"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
          tabBarLabel: 'Stats',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const theme = useAppTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background }
      }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="App" component={TabNavigator} />
            <RootStack.Screen name="AddTransaction" component={AddTransactionScreen} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
