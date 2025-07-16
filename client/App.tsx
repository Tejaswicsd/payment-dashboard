// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import TransactionDetailsScreen from './src/screens/TransactionDetailsScreen';
import AddPaymentScreen from './src/screens/AddPaymentScreen';
import PaymentStatsScreen from './src/screens/PaymentStatsScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  TransactionList: undefined;
  TransactionDetails: { transactionId: string };
  AddPayment: undefined;
  Stats: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: 'Payment Dashboard',
              headerLeft: () => null, // disables back button
            }}
          />
          <Stack.Screen
            name="TransactionList"
            component={TransactionListScreen}
            options={{ title: 'Transactions' }}
          />
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetailsScreen}
            options={{ title: 'Transaction Details' }}
          />
          <Stack.Screen
            name="AddPayment"
            component={AddPaymentScreen}
            options={{ title: 'Add Payment' }}
          />
          <Stack.Screen
            name="Stats"
            component={PaymentStatsScreen}
            options={{ title: 'Stats' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
