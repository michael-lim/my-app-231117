import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, RefreshControl, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView, } from 'react-native-gesture-handler';
import { LineChart, } from 'react-native-chart-kit';

const GraphScreen = () => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  // const [dataChanged, setDataChanged] = useState(false); // 상태 추가
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData(); // 데이터 다시 불러오기
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(); // 데이터 다시 불러오기
    setRefreshing(false);
  }, [setRefreshing]);

  const getAllKeysSortedByDate = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // 키 값을 날짜 기준으로 정렬
      const sortedKeys = keys.sort((keyA, keyB) => {
        const dateA = new Date(keyA).getTime(); // keyA를 Date 객체로 변환하여 타임스탬프로 만듦
        const dateB = new Date(keyB).getTime(); // keyB를 Date 객체로 변환하여 타임스탬프로 만듦
        return dateA - dateB;
      });
      return sortedKeys;
    } catch (error) {
      console.error('Error retrieving keys:', error);
      return [];
    }
  };

  // 날짜를 기준으로 데이터를 그룹화하는 함수
  const groupDataByInterval = (data, interval) => {
    const groupedData = {};
    data.forEach(({ date, value }) => {
      const formattedDate = moment(date);
      const intervalKey = formattedDate.startOf(interval).format('YYYY-MM-DD');
      if (!groupedData[intervalKey]) {
        groupedData[intervalKey] = { date: intervalKey, total: 0, count: 0 };
      }
      groupedData[intervalKey].total += value;
      groupedData[intervalKey].count += 1;
    });
    return Object.values(groupedData);
  };

  // const groupDataByInterval = (data, interval) => {
  //   const groupedData = {};
  //   data.forEach(({ date, value }) => {
  //     const formattedDate = new Date(date);
  //     let intervalKey;
  
  //     if (interval === 'week') {
  //       const firstDayOfWeek = new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate() - formattedDate.getDay());
  //       intervalKey = `${firstDayOfWeek.getFullYear()}-${(firstDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${firstDayOfWeek.getDate().toString().padStart(2, '0')}`;
  //     } else if (interval === 'month') {
  //       intervalKey = `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
  //     }
  
  //     if (!groupedData[intervalKey]) {
  //       groupedData[intervalKey] = { date: intervalKey, total: 0, count: 0 };
  //     }
  //     groupedData[intervalKey].total += value;
  //     groupedData[intervalKey].count += 1;
  //   });
  //   return Object.values(groupedData);
  // };


  const fetchData = async () => {
    try {
      const sortedKeys = await getAllKeysSortedByDate();
      // Filter keys that match the date format 'YYYY-MM-DD'
      
      // const isValidDateFormat = (dateString) => {
      //   // 정규 표현식을 사용하여 'YYYY-MM-DD' 형식에 맞는지 확인
      //   const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
      //   return dateFormatRegex.test(dateString);
      // };
      // const filteredKeys = sortedKeys.filter((key) => isValidDateFormat(key));

      const filteredKeys = sortedKeys.filter((key) => moment(key, 'YYYY-MM-DD', true).isValid());
      const result = await AsyncStorage.multiGet(filteredKeys);
      // 데이터 형태에 맞게 변환하여 chartData로 설정
      const chartData = result.map(([key, value]) => ({
        date: key, // 날짜
        value: parseInt(value), // 저장된 값
      }));
      const recent7days = chartData.slice(-7);
      setDailyData(recent7days); // 일별 데이터 설정
      // Moment.js를 사용하여 날짜를 처리하고, 주별 데이터 계산
      const weeklyChartData = groupDataByInterval(chartData, 'week');
      const recent8weeks = weeklyChartData.slice(-8);
      setWeeklyData(recent8weeks);
      // Moment.js를 사용하여 날짜를 처리하고, 월별 데이터 계산
      const monthlyChartData = groupDataByInterval(chartData, 'month');
      const recent12months = monthlyChartData.slice(-12);
      setMonthlyData(recent12months);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>일별 그래프</Text>
          {/* 일별 그래프 */}
          <LineChart
            // style={graphStyle}
            data={{
              // labels: dailyData.map((entry) => entry.date),
              labels: dailyData.map((entry) => moment(entry.date).format('MM/DD')), // moment.js를 사용하여 날짜 형식 변경
              datasets: [
                {
                  data: dailyData.map((entry) => entry.value),
                },
              ],
            }}
            // 그래프 설정 등 추가 설정
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix=""
            fromZero
            withInnerLines
            // verticalLabelRotation="15"
            // verticalLabelRotation={-90}
            showValuesOnTopOfBars
            chartConfig={{
              // count: 10,
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              propsForLabels: { fontSize: 12, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
              // barPercentage: 0.5,
              // useShadowColorFromDataset: false, // optional
              // strokeWidth: 3,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            besier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text>주별 그래프</Text>
          {/* 주별 그래프 */}
          <LineChart
            data={{
              // labels: weeklyData.map((entry) => entry.date),
              labels: weeklyData.map((entry) => moment(entry.date).format('MM/DD')), // moment.js를 사용하여 날짜 형식 변경
              datasets: [
                {
                  data: weeklyData.map((entry) => entry.total),
                },
              ],
            }}
            // 그래프 설정 등 추가 설정
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix=""
            fromZero
            withInnerLines
            // verticalLabelRotation="-90"
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: '#dae0d5',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              propsForLabels: { fontSize: 13, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text>월별 그래프</Text>
          {/* 월별 그래프 */}
          <LineChart
            data={{
              // labels: monthlyData.map((entry) => entry.date),
              labels: monthlyData.map((entry) => moment(entry.date).format('MM')), // moment.js를 사용하여 날짜 형식 변경
              datasets: [
                {
                  data: monthlyData.map((entry) => entry.total),
                },
              ],
            }}
            // 그래프 설정 등 추가 설정
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix=""
            fromZero
            withInnerLines
            // verticalLabelRotation="-90"
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: '#dae0d5',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              propsForLabels: { fontSize: 14, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
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
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default GraphScreen;
