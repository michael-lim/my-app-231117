import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import AboutScreen from './aboutscreen';
import SettingsScreen from './SettingsScreen';
import GraphScreen from './GraphScreen';
import CalendarScreen from './CalendarScreen';
import NoSmokingScreen from './NoSmokingScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Graph" component={GraphScreen} />
      <Tab.Screen name="NoSmoking" component={NoSmokingScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <MyTabs />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;