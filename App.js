import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import AboutScreen from './aboutscreen';
import SettingsScreen from './SettingsScreen';
import GraphScreen from './GraphScreen';
import CalendarScreen from './CalendarScreen';
import NoSmokingScreen from './NoSmokingScreen';
import NSProgressScreen from './NSProgressScreen';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function MainBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        activeTintColor: 'blue', // 선택된 탭의 아이콘 색상
        inactiveTintColor: 'gray', // 선택되지 않은 탭의 아이콘 색상
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline'; // 아이콘 이름은 해당 라이브러리에 따라 다를 수 있습니다.
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
      style={styles.container}>
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="달력" component={CalendarScreen} />
      <Tab.Screen name="통계" component={GraphScreen} />
      <Tab.Screen name="금연" component={NoSmokingScreen} />
      {/* <Tab.Screen name="금연진행상황" component={NSProgressScreen} /> */}
      <Tab.Screen name="설정" component={SettingsScreen} />
      <Tab.Screen name="임시" component={AboutScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainBottomTabNavigator}  />
        <Stack.Screen name="NSProgressScreen" component={NSProgressScreen} />
      </Stack.Navigator>
      {/* <MainBottomTabNavigator /> */}
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