import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const GraphScreen = () => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sortedKeys = await getAllKeysSortedByDate();
      const result = await AsyncStorage.multiGet(sortedKeys);

      // 데이터 형태에 맞게 변환하여 chartData로 설정
      const chartData = result.map(([key, value]) => ({
        date: key, // 날짜
        value: parseInt(value), // 저장된 값
      }));

      setDailyData(chartData); // 일별 데이터 설정

      // Moment.js를 사용하여 날짜를 처리하고, 주별 데이터 계산
      const weeklyChartData = groupDataByInterval(chartData, 'week');
      setWeeklyData(weeklyChartData);

      // Moment.js를 사용하여 날짜를 처리하고, 월별 데이터 계산
      const monthlyChartData = groupDataByInterval(chartData, 'month');
      setMonthlyData(monthlyChartData);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };


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

    // 평균값 계산
    Object.keys(groupedData).forEach((key) => {
      groupedData[key].average = groupedData[key].total / groupedData[key].count;
      // groupedData[key].total = parseInt(groupedData[key].total); //토탈이 안된다.......
    });
    
    return Object.values(groupedData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Graph Screen</Text>

      {/* 일별 그래프 */}
      <BarChart
        data={{
          labels: dailyData.map((entry) => entry.date),
          datasets: [
            {
              data: dailyData.map((entry) => entry.value),
            },
          ],
        }}
        // 그래프 설정 등 추가 설정
        width={400}
        height={300}
        yAxisSuffix=""
        fromZero
        withInnerLines
        verticalLabelRotation="-90"
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

      {/* 주별 그래프 */}
      <BarChart
        data={{
          labels: weeklyData.map((entry) => entry.date),
          datasets: [
            {
              data: weeklyData.map((entry) => entry.average),
            },
          ],
        }}
      // 그래프 설정 등 추가 설정
      width={400}
      height={300}
      yAxisSuffix=""
      fromZero
      withInnerLines
      verticalLabelRotation="-90"
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

      {/* 월별 그래프 */}
      <BarChart
        data={{
          labels: monthlyData.map((entry) => entry.date),
          datasets: [
            {
              data: monthlyData.map((entry) => entry.average),
            },
          ],
        }}
      // 그래프 설정 등 추가 설정
      width={400}
      height={300}
      yAxisSuffix=""
      fromZero
      withInnerLines
      verticalLabelRotation="-90"
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
  );
};

export default GraphScreen;
