import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/aboutscreen';
import SettingsScreen from './screens/SettingsScreen';
import GraphScreen from './screens/GraphScreen';
import CalendarScreen from './screens/CalendarScreen';
import NoSmokingScreen from './screens/NoSmokingScreen';
import NSProgressScreen from './screens/NSProgressScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        activeTintColor: 'blue', // 선택된 탭의 아이콘 색상
        inactiveTintColor: 'gray', // 선택되지 않은 탭의 아이콘 색상
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '달력') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          else if (route.name === '통계') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          else if (route.name === '금연') {
            iconName = focused ? 'logo-no-smoking' : 'logo-no-smoking';
          }
          else if (route.name === '설정') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          else if (route.name === '임시') {
            iconName = focused ? 'browsers' : 'browsers-outline';
          }
          // 아이콘 컴포넌트를 반환합니다.
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="달력" component={CalendarScreen} />
      <Tab.Screen name="통계" component={GraphScreen} />
      <Tab.Screen name="금연" component={StatckNavigator} />
      <Tab.Screen name="설정" component={SettingsScreen} />
      <Tab.Screen name="임시" component={AboutScreen} />
    </Tab.Navigator>
  );
}

function StatckNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NoSmokingScreen" component={NoSmokingScreen}
        options={{
          headerShown: false, // NSProgressScreen 화면의 헤더 숨기기
        }}
      />
      <Stack.Screen name="NSProgressScreen" component={NSProgressScreen}
        options={{
          headerShown: false, // NSProgressScreen 화면의 헤더 숨기기
        }}
      />
      {/* <Stack.Screen name="홈" component={HomeScreen} options={{
        title: '홈',
        headerTitleAlign: Platform.OS === 'ios' ? 'left' : 'left',
        // headerShown: false
      }}
      /> */}
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
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