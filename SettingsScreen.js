import React, {useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Settings = () => {
  
  const resetCounters = async () => {
    try {
      await AsyncStorage.clear(); // AsyncStorage에 저장된 모든 데이터를 초기화
      // await AsyncStorage.removeItem('EXPO_CONSTANTS_INSTALLATION_ID');
      // await AsyncStorage.removeItem('weeklyCounts');
      // await AsyncStorage.removeItem('2023-11-18');
      // alert('카운터가 초기화되었습니다.');
      alert('성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error resetting counters:', error);
    }
  };

  // useEffect(() => {
  //   resetCounters();
  // })

  return (
    <View>
      {/* <Text>Settings Screen</Text> */}
      <Button title="카운터 초기화" onPress={resetCounters} />
      {/* <Button title="데이타 삭제" onPress={resetCounters} /> */}
    </View>
  );
};

export default Settings;
export const resetCounters = () => {};