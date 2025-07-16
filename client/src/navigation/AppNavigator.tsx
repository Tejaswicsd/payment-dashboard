import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PaymentStatsScreen from '../screens/PaymentStatsScreen'; // ✅ Add this

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Stats" component={PaymentStatsScreen} /> {/* ✅ Wire it here */}
    </Stack.Navigator>
  );
}
