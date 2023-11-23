import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import moment from "moment";

const HomeScreen = () => {

  const [counter, setCounter] = useState(0);
  const [counterYesterday, setCounterYesterday] = useState(0);
  const [lastCountDate, setLastCountDate] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    // fetchData();
    //saveCounter(); // 카운터 변경 시 저장
    retrieveCount(); //페이지 리로딩시 저장된 카운트수 가져옴
    getCounterYesterday();
    setLastCountDate(moment().format("YYYY-MM-DD HH:mm:ss"));

    setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));

    const intervalId = setInterval(() => {
      setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));
    }, 1000);
    // 컴포넌트가 unmount될 때 타이머 해제
    return () => clearInterval(intervalId);

  }, [counter, counterYesterday]);


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
      setLastCountDate(moment().format("YYYY-MM-DD HH:mm:ss"));
      setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // const retrieveCount = async () => {
  //   try {
  //     const today = new Date();
  //     const year = today.getFullYear();
  //     const month = today.getMonth() + 1;
  //     const date = today.getDate();
  //     const currentDate = year + "-" + month + "-" + date;
  //     const savedCount = await AsyncStorage.getItem(currentDate);
  //     if (savedCount !== null) {
  //       setCounter(parseInt(savedCount, 10));
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving count:', error);
  //   }
  // };

  const retrieveCount = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const currentDate = `${year}-${month}-${date}`;
      const savedCount = await AsyncStorage.getItem(currentDate);

      if (savedCount !== null) {
        setCounter(parseInt(savedCount, 10));
      }

      const dataFromStorage = await getRecentSevenDays();
      setDailyData(dataFromStorage);
    } catch (error) {
      console.error('Error retrieving count:', error);
    }
  };

  // const getAllDataFromStorage = async () => {
  //   try {
  //     // Retrieve all keys from AsyncStorage
  //     const keys = await AsyncStorage.getAllKeys();

  //     // Filter keys that match the date format 'YYYY-MM-DD'
  //     const filteredKeys = keys.filter((key) => moment(key, 'YYYY-MM-DD', true).isValid());

  //     // Retrieve data for the filtered keys
  //     const items = await AsyncStorage.multiGet(filteredKeys);

  //     // Map the items to required format
  //     const data = items.map(([key, value]) => ({ date: key, value: parseInt(value, 10) }));

  //     return data;
  //   } catch (error) {
  //     console.error('Error retrieving data:', error);
  //     return [];
  //   }
  // };

  const getRecentSevenDays = async () => {
    try {
      // Retrieve all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // Filter keys that match the date format 'YYYY-MM-DD'
      const filteredKeys = keys.filter((key) => moment(key, 'YYYY-MM-DD', true).isValid());
  
      // Sort keys in descending order to get the most recent ones
      filteredKeys.sort((a, b) => moment(b, 'YYYY-MM-DD').diff(moment(a, 'YYYY-MM-DD')));
  
      // Take only the first 7 keys
      const recentKeys = filteredKeys.slice(0, 7);
      // const recentKeys = filteredKeys.slice(-7);
  
      // Retrieve data for the filtered keys
      const items = await AsyncStorage.multiGet(recentKeys);
  
      // Map the items to required format
      const data = items.map(([key, value]) => ({ date: key, value: parseInt(value, 10) }));
  
      return data.reverse();
    } catch (error) {
      console.error('Error retrieving data:', error);
      return [];
    }
  };

  const getCounterYesterday = async () => {
    try {
      const today = new Date();
      // 어제 날짜 계산
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const year = yesterday.getFullYear();
      const month = yesterday.getMonth() + 1;
      const date = yesterday.getDate();
      const yesterdayDate = year + "-" + month + "-" + date;

      const savedCount = await AsyncStorage.getItem(yesterdayDate);
      if (savedCount !== null) {
        setCounterYesterday(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error retrieving count:', error);
    }
  }

  const displayElapsedTime = () => {
    let display = '';
    const years = Math.floor(elapsedTime / 31536000);
    const months = Math.floor((elapsedTime % 31536000) / 2592000);
    const days = Math.floor(((elapsedTime % 31536000) % 2592000) / 86400);
    const hours = Math.floor((((elapsedTime % 31536000) % 2592000) % 86400) / 3600);
    const minutes = Math.floor(((((elapsedTime % 31536000) % 2592000) % 86400) % 3600) / 60);
    const seconds = (((elapsedTime % 31536000) % 2592000) % 86400) % 3600 % 60;

    if (years > 0) {
      display += `${years}년 `;
    }
    if (months > 0) {
      display += `${months}개월 `;
    }
    if (days > 0) {
      display += `${days}일 `;
    }
    if (hours > 0) {
      display += `${hours}시간 `;
    }
    if (minutes > 0) {
      display += `${minutes}분 `;
    }
    if (seconds > 0) {
      display += `${seconds}초`;
    }

    return display.trim(); // 마지막에 공백 제거
  };


  return (
    <View style={styles.container}>

      <View style={styles.rowContainer}>
        <View style={styles.section}>
          <View style={styles.textContainer}>
            <Text style={styles.counterText}>오늘: {counter} </Text>
            <Text style={styles.counterText}>어제: {counterYesterday} </Text>
            <Text style={styles.counterText}>증감: {counter - counterYesterday} </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.counterText}>마지막흡연: {lastCountDate} </Text>
          <Text style={styles.counterText}>경과: {displayElapsedTime()} </Text>
        </View>

        <View style={styles.textContainer}>
          <Text>Graph Screen</Text>
        </View>
        <View style={styles.Graphsection}>
          <BarChart
            data={{
              labels: dailyData.map((entry) => entry.date),
              datasets: [
                {
                  data: dailyData.map((entry) => entry.value),
                },
              ],
            }}
            width={500}
            height={300}
            yAxisSuffix=""
            fromZero
            withInnerLines
            verticalLabelRotation={-90}
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: '#dae0d5',
              backgroundGradientFrom: '#0377fc',
              backgroundGradientTo: '#0377fc',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

      </View>

      <View>
        <TouchableOpacity style={styles.circularButton} onPress={incrementCounter}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF', // 연한 분홍색 배경
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // 글자 색상
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
    backgroundColor: '#FFC0CB', // 버튼 배경색
  },
  section: {
    flex: 1,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    backgroundColor: '#ede4e4',
    borderWidth: 1,
    borderColor: 'lightgray',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'left',
  },
  Graphsection: {
    flex: 6,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    backgroundColor: '#ede4e4',
    borderWidth: 1,
    borderColor: 'lightgray',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'left',
  },

  rowContainer: {
    flexDirection: 'column', // 수평으로 나열되도록 설정
    width: '100%', // 부모 View의 너비를 화면 크기에 맞추기 위해 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    paddingHorizontal: '5%', // 좌우 여백을 더해 화면의 90%를 차지하도록 설정
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    paddingHorizontal: 10, // 텍스트 박스 간 간격을 조절할 수 있는 여백 설정
    justifyContent: 'center',
    alignItems: 'flex-start', // 텍스트를 왼쪽으로 정렬
  },
  // 동그란 버튼 스타일
  circularButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 40,
    color: '#FFF',
  },
});

export default HomeScreen;