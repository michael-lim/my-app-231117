import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutScreen = () => {

  // const { counter } = route.params; // Home 화면에서 전달된 카운터 값
  const [counterHistory, setCounterHistory] = useState([]);
  const [counterToday, setCounterToday] = useState([]);
  const [getOneItem, setGetOneItem] = useState([]);

  const fetchCounterHistory = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const history = await AsyncStorage.multiGet(keys);
      setCounterHistory(history);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const fetchCounterToday = async () => {
    try {
      const todayKey = new Date().toDateString();
      const todayValue = await AsyncStorage.getItem(todayKey);
      setCounterToday(todayValue ? [[todayKey, todayValue]] : []);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const fetchGetOneItem = async () => {
    try {
      const key = 'Thu Nov 16 2023';
      const value = await AsyncStorage.getItem(key);
      setGetOneItem(value ? [[key, value]] : []);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    fetchCounterHistory(); // 화면이 로드될 때 저장된 모든 값 불러오기
    fetchCounterToday(); // 화면이 로드될 때 저장된 오늘의 카운트 값만 불러오기
    fetchGetOneItem();
  }, []);

  return (
    <View>
      <Text>About 화면</Text>
      {/* <Text>Home에서 받은 카운터 값: {counter}</Text> */}
      <Text>Counter History:</Text>
      {counterHistory.map(([date, value]) => (
        //{counterToday.map(([date, value]) => (
        //{getOneItem.map(([date, value]) => (
        <Text key={date}>{`${date}: ${value}`}</Text>
      ))}
    </View>
  );
};

export default AboutScreen;