import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarSmoking = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateCount, setSelectedDateCount] = useState(0);
  const [selectedDateData, setSelectedDateData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const allData = await AsyncStorage.multiGet(allKeys);
        const markedDatesData = {};
        allData.forEach(([key, value]) => {
          const chartData = allData.map(([key, value]) => ({
            date: key, // 날짜
            value: parseInt(value), // 저장된 값
          }));
          markedDatesData[key] = {
            selected: true,
            marked: true,
            selectedColor: 'blue',
            dotColor: 'white',
            dots: [
              {
                key: 'value',
                color: 'white',
                selectedDotColor: 'blue',
                selected: true,
              },
            ],
          };
        });
        setMarkedDates(markedDatesData);
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchDataForSelectedDate = async (day) => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      const dateDataList = [];
      const storedData = await AsyncStorage.getItem(day.dateString);
      setSelectedDateCount(storedData ? parseInt(storedData) : 0);
      if (storedData) {
        allData.forEach(([key, value]) => {
          const chartData = allData.map(([key, value]) => ({
            date: key, // 날짜
            value: parseInt(value), // 저장된 값
          }));
          // const filteredKeys = allKeys.filter((key) => moment(key, 'YYYY-MM-DD HH:mm:ss', true).isValid());
          // 선택한 날짜만 시간정보를 뿌려주는 부분인데 느리다. 고쳐야 한다.
          if (key.split(' ')[0] === day.dateString)
            setSelectedDateData([]);
          if (key.split(' ')[0] === day.dateString && isValidDate(key)) {
            const dateDetail = { date: key, value };
            dateDataList.push(dateDetail);
            setSelectedDateData(dateDataList);
          }
        });
      } else {
        setSelectedDateData([]);
      };
    } catch (error) {
      console.error('Error retrieving data for selected date:', error);
    }
  };
  // 정확한 날짜 및 시간 형식인지 확인하는 함수
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => fetchDataForSelectedDate(day)}
      />
      <View style={{ padding: 10 }}>
        <Text style={styles.titleText}>총 흡연수: {selectedDateCount + " 개피"}</Text>
        <FlatList
          data={selectedDateData}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <Text style={styles.detailedText}>{`흡연시간정보: ${item.date}`}</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  detailedText: {
    fontSize: 15,
  },
})

export default CalendarSmoking;