import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { resetCounter } from './SettingsScreen';

const HomeScreen = ({ navigation }) => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    const newCount = counter + 1;
    setCounter(newCount);
    saveCounter(newCount); // 카운트 증가할 때마다 AsyncStorage에 저장
  };

  const saveCounter = async (counter) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const currentDate = year + "-" + month + "-" + date;
      await AsyncStorage.setItem(currentDate, counter.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveCounterYesterday = async () => {
    try {
      const today = new Date();
      // 어제 날짜 계산
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // const yesterdayDate = yesterday.toDateString();

      const year = yesterday.getFullYear();
      const month = yesterday.getMonth() + 1;
      const date = yesterday.getDate();
      const yesterdayDate = year + "-" + month + "-" + date;

      await AsyncStorage.setItem(yesterdayDate, '7');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const retrieveCount = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const currentDate = year + "-" + month + "-" + date;
      const savedCount = await AsyncStorage.getItem(currentDate);
      if (savedCount !== null) {
        setCounter(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error retrieving count:', error);
    }
  };

  useEffect(() => {
    //saveCounter(); // 카운터 변경 시 저장
    retrieveCount(); //페이지 리로딩시 저장된 카운트수 가져옴
  }, [counter]);

  const navigateToAbout = () => {
    navigation.navigate('About');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToGraph = () => {
    navigation.navigate('Graph');
  };

  const navigateToCalendar = () => {
    navigation.navigate('Calendar');
  };

  const navigateToNoSmoking = () => {
    navigation.navigate('NoSmoking');
  };

  // const navigateToAbout = () => {
  //   navigation.navigate('About', { counter }); // 카운터 값을 About 화면으로 전달
  // };

  return (
    <View>
      <Text>카운터: {counter}</Text>
      <Button title="카운터 증가" onPress={incrementCounter} />
      <Button title="About로 이동" onPress={navigateToAbout} />
      <Button title="Settings로 이동" onPress={navigateToSettings} />
      <Button title="과거 날짜로 카운터 저장" onPress={saveCounterYesterday} />
      <Button title="그래프로 이동" onPress={navigateToGraph} />
      <Button title="캘린더로 이동" onPress={navigateToCalendar} />
      <Button title="금연페이지로 이동" onPress={navigateToNoSmoking} />
    </View>
  );
};

export default HomeScreen;