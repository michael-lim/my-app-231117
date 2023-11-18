import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutScreen = () => {

  // const { counter } = route.params; // Home 화면에서 전달된 카운터 값
  const [counterHistory, setCounterHistory] = useState([]);
  const [counterToday, setCounterToday] = useState([]);
  const [getOneItem, setGetOneItem] = useState([]);

  ////////////날짜별 정렬을 위해
  const getAllKeysSortedByDate = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      // 키 값을 날짜 기준으로 정렬
      const sortedKeys = keys.sort((keyA, keyB) => {
        const dateA = new Date(keyA).getTime(); // keyA를 Date 객체로 변환하여 타임스탬프로 만듦
        const dateB = new Date(keyB).getTime(); // keyB를 Date 객체로 변환하여 타임스탬프로 만듦
        return dateA - dateB;
      });
      // console.log(sortedKeys);
      return sortedKeys;
    } catch (error) {
      console.error('Error retrieving keys:', error);
      return [];
    }
  };

  const fetchCounterHistory = async () => {
    try {
      const sortedKeys = await getAllKeysSortedByDate();
      // 정렬된 키 값들을 기반으로 데이터를 순차적으로 읽어옴
      // const sortedData = await Promise.all(sortedKeys.map(async (key) => {
      //   const value = await AsyncStorage.getItem(key);
      //   return { key, value }; // 혹은 값을 다른 형태로 반환
      // }));
 //     return sortedData;

      // const keys = await AsyncStorage.getAllKeys();
      // const history = await AsyncStorage.multiGet(keys);
      const history = await AsyncStorage.multiGet(sortedKeys);
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