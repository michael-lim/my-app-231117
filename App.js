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
    <Tab.Navigator style={styles.container}>
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="캘린더" component={CalendarScreen} />
      <Tab.Screen name="통계" component={GraphScreen} />
      <Tab.Screen name="금연" component={NoSmokingScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
      <Tab.Screen name="임시" component={AboutScreen} />
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
    // fontSize: 50,
  },
});

export default App;