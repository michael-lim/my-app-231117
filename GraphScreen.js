import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BarChart  } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GraphScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);

        // 데이터 형태에 맞게 변환하여 setData로 설정
        const chartData = result.map(([key, value]) => ({
          date: key, // 날짜
          value: parseInt(value), // 저장된 값
        }));
        setData(chartData);
        console.log(chartData);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Graph Screen</Text>
      <BarChart
        data={{
          labels: data.map((entry) => entry.date),
          datasets: [
            {
              data: data.map((entry) => entry.value),
            },
          ],
        }}
        width={550}
        height={500}
        yAxisSuffix=""
        fromZero
        withInnerLines
        
        
        verticalLabelRotation="-90"
        
        showValuesOnTopOfBars

        chartConfig={{
          backgroundColor: '#eee',
          // backgroundGradientFrom: '#0377fc',
          // backgroundGradientTo: '#0377fc',
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