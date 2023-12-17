import React, { useState, useEffect, useRef, } from 'react';
import { View, Text, FlatList, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const CalendarSmoking = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateCount, setSelectedDateCount] = useState(0);
  const [selectedDateData, setSelectedDateData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // 추가: 이전 선택된 날짜를 기록
  const flatListRef = useRef(null);

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
      const dateDataList = [];
      const storedData = await AsyncStorage.getItem(day.dateString);
      setSelectedDateCount(storedData ? parseInt(storedData) : 0);
      if (storedData) {
        const allData = await AsyncStorage.multiGet(allKeys);
        allData.forEach(([key, value]) => {
          const dateKey = key.split(' ')[0];
          if (dateKey === day.dateString && moment(key, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            const dateDetail = { date: key, value: parseInt(value) };
            dateDataList.push(dateDetail);
          }
        });
        // 시간까지 포함된 데이터만 출력하고 정렬
        dateDataList.sort((a, b) => moment(a.date, 'YYYY-MM-DD HH:mm:ss') - moment(b.date, 'YYYY-MM-DD HH:mm:ss'));
        setSelectedDateData(dateDataList);
      } else {
        setSelectedDateData([]);
      }
      const updatedMarkedDates = { ...markedDates };
      if (selectedDate && updatedMarkedDates[selectedDate]) {
        updatedMarkedDates[selectedDate] = {
          ...updatedMarkedDates[selectedDate],
          selectedColor: 'blue', // 이전 선택된 날짜의 색상을 파란색으로 변경
        };
      }
      updatedMarkedDates[day.dateString] = {
        ...updatedMarkedDates[day.dateString],
        selectedColor: 'red', // 클릭된 날짜의 색상을 빨간색으로 변경
      };
      setMarkedDates(updatedMarkedDates);
      setSelectedDate(day.dateString); // 클릭된 날짜를 기록
    } catch (error) {
      console.error('Error retrieving data for selected date:', error);
    }
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
        inverted  // inverted 속성 추가
          //  style={{ flex: 1 }} // 높이를 자식 요소에 맞게 조절
          data={selectedDateData}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <Text style={styles.detailedText}>{`흡연시간정보: ${item.date}`}</Text>
          )}
          // 스크롤 이벤트 시 맨 아래의 데이터를 자연스럽게 볼 수 있도록 스크롤을 아래로 이동시켜주는 효과
          onContentSizeChange={() => {
            // FlatList의 길이가 변화될 때 스크롤을 맨 아래로 이동시킵니다.
            flatListRef.current.scrollToEnd({ animated: true });
          }}
          ref={(ref) => {
            flatListRef.current = ref;
          }}
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