// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Calendar, LocaleConfig } from 'react-native-calendars';

// LocaleConfig.locales['en'] = {
//   monthNames: [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ],
//   monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
//   dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//   dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
// };

// LocaleConfig.defaultLocale = 'en';

// const CalendarWithNumbers = () => {
//   const [markedDates, setMarkedDates] = useState({});

//   useEffect(() => {
//     // AsyncStorage에서 데이터를 읽어옴
//     const fetchData = async () => {
//       try {
//         // AsyncStorage에서 데이터를 읽어옴 (예시로 '2023-11-18' 날짜에 5를 가정)
//         const storedData = await AsyncStorage.getItem('2023-11-18');

//         // 읽어온 데이터를 markedDates 형식에 맞게 가공하여 저장
//         if (storedData) {
//           setMarkedDates({
//             ...markedDates,
//             '2023-11-18': { selected: true, marked: true, selectedColor: 'blue', dotColor: 'white', textColor: 'blue', dotText: storedData },
//           });
//         }
//       } catch (error) {
//         console.error('Error retrieving data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <View style={{ flex: 1 }}>
//       <Calendar
//         markedDates={markedDates}
//         onDayPress={(day) => {
//           console.log('selected day', day);
//           // 선택한 날짜에 해당하는 데이터를 AsyncStorage에서 읽어올 수 있음
//           // 이후 상세한 처리를 할 수 있음
//         }}
//       />
//     </View>
//   );
// };

// export default CalendarWithNumbers;



import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

LocaleConfig.defaultLocale = 'en';

const CalendarWithNumbers = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateCount, setSelectedDateCount] = useState(0);
  const [selectedDateDetail, setSelectedDateDetail] = useState('');

  useEffect(() => {
    // AsyncStorage에서 모든 데이터를 읽어옴
    const fetchData = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const allData = await AsyncStorage.multiGet(allKeys);

        // 읽어온 데이터를 markedDates 형식에 맞게 가공하여 저장
        const markedDatesData = {};
        allData.forEach(([key, value]) => {
          //markedDatesData[key] = { selected: true, marked: true, selectedColor: 'blue', dotColor: 'white', textColor: 'blue', dotText: value };
          
          // markedDatesData[key] = { selected: true, marked: true, selectedColor: 'blue', text: value, // text 속성을 사용하여 텍스트 표시
          // textStyle: { color: 'white', fontWeight: 'bold' } }; // textStyle 속성을 사용하여 텍스트 스타일 지정
          
          // markedDatesData[key] = { selected: true, marked: true, selectedColor: 'blue', // 각 날짜의 스타일 및 표시 방법을 변경함
          //   customStyles: {
          //     container: { backgroundColor: 'blue' },
          //     text: { color: 'white', fontWeight: 'bold' },
          //   },
          //   dots: [{ key: 'count', color: 'white', selectedDotColor: 'blue' }], // dots 속성을 사용하여 점을 대체함
          //   count: value ? parseInt(value) : 0, // count 속성을 사용하여 표시할 값을 설정함

          markedDatesData[key] = { selected: true, marked: true, selectedColor: 'blue', // 각 날짜의 스타일 및 표시 방법을 변경함
          dotColor: 'white',
          dots: [
            {
              key: 'count',
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
      const storedData = await AsyncStorage.getItem(day.dateString);
      setSelectedDateCount(storedData ? parseInt(storedData) : 0);
      setSelectedDateDetail(`Date: ${day.dateString}, Count: ${storedData || 0}`);
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
        <Text>Selected Date Detail:</Text>
        <Text>{selectedDateDetail}</Text>
        <Text>Selected Date Count: {selectedDateCount}</Text>
      </View>
    </View>

  //   <View style={{ flex: 1 }}>
  //   <Calendar
  //     markedDates={markedDates}
  //     onDayPress={(day) => fetchDataForSelectedDate(day)}
  //     markingType="multi-dot"
  //     style={{ borderWidth: 1, borderColor: 'gray', height: 350 }}
  //     theme={{
  //       selectedDayBackgroundColor: 'blue',
  //       selectedDayTextColor: 'white',
  //       todayTextColor: 'red',
  //     }}
  //   />
  //   <View style={{ padding: 10 }}>
  //     <Text>Selected Date Detail:</Text>
  //     <Text>{selectedDateDetail}</Text>
  //     <Text>Selected Date Count: {selectedDateCount}</Text>
  //   </View>
  // </View>


  );
};

export default CalendarWithNumbers;

