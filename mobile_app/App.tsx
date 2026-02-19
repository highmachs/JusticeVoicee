import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalculatorScreen from './screens/CalculatorScreen';
import LegalHomeScreen from './screens/LegalHomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* @ts-ignore - Stack.Navigator type definition mismatch with React 18 types */}
      <Stack.Navigator initialRouteName="Calculator" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="LegalHome" component={LegalHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
