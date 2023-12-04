import React, { useState, useEffect, useRef, useMemo, useCallback, } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, Button, KeyboardAvoidingView, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import moment from "moment";
import { Swipeable, GestureHandlerRootView, } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModalProvider, BottomSheetModal, } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
// import { resetCounters } from './SettingsScreen';


const HomeScreen = () => {

  const [counter, setCounter] = useState(0);
  const [counterTime, setCounterTime] = useState(1);
  const [counterYesterday, setCounterYesterday] = useState(0);
  const [lastCountDate, setLastCountDate] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeksData, setWeeksData] = useState([]);
  const [inputCount, setInputCount] = useState(0);
  const [inputDate, setInputDate] = useState('');
  const bottomSheetModalRef = useRef(null);



  useEffect(() => {
    // resetCounters();
    // saveCounter(); // 카운터 변경 시 저장
    retrieveCount(); //페이지 리로딩시 저장된 카운트수 가져옴
    getCounterYesterday();

    setLastCountDate(moment().format("YYYY-MM-DD HH:mm:ss"));
    // setLastCountDate(`${moment().format("YYYY-MM-DD")}\n   ${moment().format("HH:mm:ss")}`);
    setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));
    const intervalId = setInterval(() => {
      setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));
    }, 1000);
    // 컴포넌트가 unmount될 때 타이머 해제
    return () => clearInterval(intervalId);
  }, [counter, counterYesterday]);



  useEffect(() => {
    fetchWeeklyData();
  }, []);

  // 여러 주차의 데이터를 가져옵니다
  const fetchWeeklyData = async () => {
    // getRecentSevenDays() 함수가 일주일치 데이터를 가져오는 것으로 가정합니다
    const data = await getRecentSevenDays();
    // 데이터를 주차별로 나눕니다
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    setWeeksData(weeks);
  };

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

  const incrementCounter = () => {
    const newCount = counter + 1;
    setCounter(newCount);
    saveCounter(newCount); // 카운트 증가할 때마다 AsyncStorage에 저장
    setCounterTime(1);
    saveCounterTime(1); // 카운트 증가할 때마다 AsyncStorage에 저장
  };

  const incrementCounterTime = () => {
    const newCount = 1;
    setCounterTime(newCount);
    saveCounterTime(newCount); // 카운트 증가할 때마다 AsyncStorage에 저장
  };

  const saveCounter = async (counter) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      // const month = today.getMonth() + 1;
      // const date = today.getDate();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(today.getDate()).padStart(2, '0'); // 일을 두 자리로 변환
      const currentDate = year + "-" + month + "-" + date;
      // console.log(currentDate);
      await AsyncStorage.setItem(currentDate, counter.toString());

      setLastCountDate(moment().format("YYYY-MM-DD HH:mm:ss"));
      setElapsedTime(moment().diff(moment(lastCountDate), "seconds"));
      // saveCounterTime();

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveCounterTime = async (counter) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      // const month = today.getMonth() + 1;
      // const date = today.getDate();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(today.getDate()).padStart(2, '0'); // 일을 두 자리로 변환
      // const hours = today.getHours();
      const hours = String(today.getHours()).padStart(2, '0'); // 시간을 두 자리로 변환
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const seconds = String(today.getSeconds()).padStart(2, '0');
      const currentDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      await AsyncStorage.setItem(currentDate, counterTime.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const retrieveCount = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      // const month = today.getMonth() + 1;
      // const date = today.getDate();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(today.getDate()).padStart(2, '0'); // 일을 두 자리로 변환

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

  const getCounterYesterday = async () => {
    try {
      const today = new Date();
      // 어제 날짜 계산
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const year = yesterday.getFullYear();
      // const month = yesterday.getMonth() + 1;
      // const date = yesterday.getDate();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(yesterday.getDate()).padStart(2, '0'); // 일을 두 자리로 변환
      const yesterdayDate = year + "-" + month + "-" + date;

      const savedCount = await AsyncStorage.getItem(yesterdayDate);
      if (savedCount !== null) {
        setCounterYesterday(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error retrieving count:', error);
    }
  }

  // 경과시간 계산
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
      display += `${days}일\n `;
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

  const swipeRight = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const swipeLeft = () => {
    if (currentWeekIndex < weeksData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  //////////////////////////////////////////////////////////////수동입력박스
  const handleInputChange = (text) => {
    setInputCount(parseInt(text, 10));
  };

  const handleDateChange = (text) => {
    setInputDate(text);
  };

  const handleManualCountSubmit = async () => {
    if (!inputDate || !moment(inputDate, 'YYYY-MM-DD', true).isValid()) {
      alert('올바른 형식(YYYY-MM-DD)으로 날짜를 입력해주세요.');

      // 입력 완료 후 입력값 초기화
      setInputCount('');
      setInputDate('');
      bottomSheetModalRef.current?.close(); // Bottom Sheet 닫기

      return;
    }

    if (isNaN(inputCount) || inputCount < 0) {
      alert('유효한 숫자를 입력해주세요.');
      return;
    }

    try {
      await AsyncStorage.setItem(inputDate, inputCount.toString());
      alert(`날짜 ${inputDate}에 카운트 ${inputCount} 추가되었습니다!`);
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    }
  };


  // ref    바텀시트사용을 위한 코드
  const bottomSheetRef = useRef < BottomSheet > (null);
  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <ScrollView style={{ flex: 1 }}> */}
      <View style={styles.container}>
        <View style={styles.rowContainer}>

          <View style={styles.SectionContainer}>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.counterText}>  오늘{'\n'}</Text>
                <Text style={styles.counter}>{counter} 개</Text>
              </View>
              <View>
                <Text style={styles.counterText}> 어제{'\n'}</Text>
                <Text style={styles.counter}>{counterYesterday} 개</Text>
              </View>
              <View>
                {/* <Text style={styles.counterValue}>{counter - counterYesterday}</Text> */}

                {counter - counterYesterday >= 0 ? (
                  // 양수일 때
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...styles.counterValue, color: 'red' }}>{counter - counterYesterday}</Text>
                    <Ionicons name="arrow-up" size={20} color="red" />
                  </View>
                ) : (
                  // 음수일 때
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...styles.counterValue, color: 'blue' }}>{counter - counterYesterday}</Text>
                    <Ionicons name="arrow-down" size={20} color="blue" />
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.SectionContainer}>
            <View style={styles.textContainer}>
              <View>
                <Text style={styles.counterText}>     마지막흡연{'\n'}</Text>
                <Text style={styles.counter}>{lastCountDate}</Text>
              </View>
              <View>
                <Text style={styles.counterText}>경과{'\n'}</Text>
                <Text style={styles.counter}>{displayElapsedTime()}</Text>
              </View>

            </View>
          </View>

          <View style={styles.graphContainer}>
            <Swipeable
              friction={2}
              leftThreshold={40}
              rightThreshold={40}
              renderLeftActions={() => (
                <View>
                  <TouchableOpacity onPress={swipeLeft}>
                    {/* <Text>전주</Text> */}
                    {/* <BarChart
                        data={{
                          labels: weeksData[currentWeekIndex]?.map((entry) => entry.date) || [],
                          datasets: [
                            {
                              data: weeksData[currentWeekIndex]?.map((entry) => entry.value) || [],
                            },
                          ],
                        }}
                        width={Dimensions.get("window").width}
                        height={300}
                        yAxisSuffix=""
                        // yAxisInterval={100} // optional, defaults to 1
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
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      /> */}
                  </TouchableOpacity>
                </View>
              )}
              renderRightActions={() => (
                <View>
                  <TouchableOpacity onPress={swipeRight}>
                    {/* <Text>다음주</Text> */}
                    {/* <BarChart
                        data={{
                          labels: weeksData[currentWeekIndex]?.map((entry) => entry.date) || [],
                          datasets: [
                            {
                              data: weeksData[currentWeekIndex]?.map((entry) => entry.value) || [],
                            },
                          ],
                        }}
                        width={Dimensions.get("window").width}
                        height={300}
                        yAxisSuffix=""
                        // yAxisInterval={100} // optional, defaults to 1
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
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                        }}
                      /> */}
                  </TouchableOpacity>
                </View>
              )}
              // onSwipeableLeftOpen={swipeLeft}
              // onSwipeableRightOpen={swipeRight}
              onSwipeableOpen={(Directions) => {
                if (Directions === 'left') {
                  swipeLeft();
                } else if (Directions === 'right') {
                  swipeRight();
                }
              }
              }
            >
              <View>
                {/* <Text style={{ textAlign: 'center' }}>일별</Text>
                <Text style={{ textAlign: 'right' }}>이번주 날짜</Text> */}
                {/* <Text>이번주</Text> */}
                <BarChart
                  data={{
                    labels: weeksData[currentWeekIndex]?.map((entry) => moment(entry.date).format('MM-DD')) || [],
                    // labels: weeksData.map((entry) => moment(entry.date).format('MM-DD')), // moment.js를 사용하여 날짜 형식 변경
                    datasets: [
                      {
                        data: weeksData[currentWeekIndex]?.map((entry) => entry.value) || [],
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width}
                  height={300}
                  yAxisSuffix=""
                  // yAxisInterval={100} // optional, defaults to 1
                  fromZero
                  withInnerLines
                  // verticalLabelRotation={-90}
                  showValuesOnTopOfBars
                  chartConfig={{

                    backgroundColor: '#dae0d5',
                    backgroundGradientFrom: '#0377fc',
                    backgroundGradientTo: '#0377fc',
                    decimalPlaces: 0,
                    propsForLabels: { fontSize: 12, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </Swipeable>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.circularButton} onPress={incrementCounter}>

              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circularButtonInput} onPress={() => bottomSheetModalRef.current?.present()}>
              <Text style={styles.buttonTextInput}>...</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Sheet */}
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={['70%', '30%']}
              backdropComponent={() => (
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
              )}
            >
              <View style={styles.bottomSheet}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.keyboardAvoidingView}
                >
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setInputCount(text)}
                    value={inputCount.toString()}
                    keyboardType="numeric"
                    placeholder="카운트 입력"
                  />
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setInputDate(text)}
                    value={inputDate}
                    placeholder="날짜 입력 (YYYY-MM-DD)"
                  />
                  <Button title="입력" onPress={handleManualCountSubmit} />
                </KeyboardAvoidingView>
              </View>
            </BottomSheetModal>
          </BottomSheetModalProvider>

        </View>
      </View>
      {/* </ScrollView> */}
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 20,
    backgroundColor: '#FFF', // 연한 분홍색 배경
    // margin: 0,
    // padding: 0,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'column', // 수평으로 나열되도록 설정
    width: '100%', // 부모 View의 너비를 화면 크기에 맞추기 위해 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    // paddingHorizontal: '5%', // 좌우 여백을 더해 화면의 90%를 차지하도록 설정

  },
  SectionContainer: {
    flex: 2,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    backgroundColor: '#ebedee',
    // borderWidth: 1,
    // borderColor: 'lightgray',
    borderRadius: 10,
    margin: 10,
    // justifyContent: 'center',
    // alignItems: 'left',
  },
  textContainer: {
    flex: 1,
    height: 80,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    paddingHorizontal: 10, // 텍스트 박스 간 간격을 조절할 수 있는 여백 설정
    justifyContent: 'space-between',
    alignItems: 'center', // 텍스트를 왼쪽으로 정렬
    marginLeft: 20,
    marginRight: 20,
    // marginBottom: 20,
    // marginTop: 20,

  },
  counterText: {
    fontSize: 15,
    // fontWeight: '500',
    // marginBottom: 20,
    color: '#3333ff', // 글자 색상
    // alignItems: 'center', // 텍스트를 왼쪽으로 정렬
    // justifyContent: 'center',
    marginBottom: -15,

  },
  counter: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: '500',
    // marginBottom: 20,
    color: '#333', // 글자 색상
    // alignItems: 'center', // 텍스트를 왼쪽으로 정렬
    // margin:0,
    // lineHeight: 20,
  },
  counterValue: {//증감텍스트는 별도로 셋팅
    fontSize: 30,
    fontWeight: '500',
    // marginBottom: 20,
    color: '#333', // 글자 색상
    // alignItems: 'center', // 텍스트를 왼쪽으로 정렬
    // margin:0,
  },
  graphContainer: {
    // flex: 1,
    // flexDirection: 'row', // 수평으로 나열되도록 설정
    // justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    // backgroundColor: '#ede4e4',
    // borderWidth: 1,
    // borderColor: 'lightgray',
    // margin: 10,
    // marginLeft: 10,
    // marginRight: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 30,
  },
  buttonContainer: {
    // marginVertical: 10,
    // width: '80%',
    borderRadius: 8,
    // backgroundColor: '#FFF', // 버튼 배경색
    alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'row',
    // position: 'relative',
    marginTop: 20,
  },
  circularButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f4f64',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
    // flexDirection: 'row',
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
  circularButtonInput: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#4f4f64',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    // marginLeft: 10,
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    right: 80,
  },
  buttonText: {
    fontSize: 40,
    color: '#FFF',
  },
  buttonTextInput: {
    fontSize: 40,
    color: '#FFF',
    textAlign: 'center', // 텍스트를 가운데 정렬
    lineHeight: 30, // 텍스트를 버튼의 세로 중앙에 정렬
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
// export const retrieveCount = () => {};