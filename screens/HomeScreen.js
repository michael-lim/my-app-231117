import React, { useState, useEffect, useRef, useMemo, useCallback, } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, Button, KeyboardAvoidingView, Platform, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import moment from "moment";
import { Swipeable, GestureHandlerRootView, ScrollView, } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetModalProvider, BottomSheetModal, } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { resetCounters } from './SettingsScreen';
// import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const windowHeight = Dimensions.get('window').height;

  // const navigation = useNavigation();

  const [counter, setCounter] = useState(0);
  const [counterTime, setCounterTime] = useState(1);
  const [counterYesterday, setCounterYesterday] = useState(0);
  const [lastCountDate, setLastCountDate] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeksData, setWeeksData] = useState([]);
  const [inputCount, setInputCount] = useState('');
  const [inputDate, setInputDate] = useState('');
  const bottomSheetModalRef = useRef(null);

  useEffect(() => {
    retrieveCount(); //페이지 리로딩시 저장된 카운트수 가져옴
    getCounterYesterday();
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

    // saveCounterTime();
  };

  const saveCounter = async (counter) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(today.getDate()).padStart(2, '0'); // 일을 두 자리로 변환
      const currentDate = year + "-" + month + "-" + date;
      await AsyncStorage.setItem(currentDate, counter.toString());
      retrieveLastCountDate(); //저장시 최종흡연일자 업데이트
      fetchWeeklyData(); //저장시 그래프 업데이트
      saveCounterTime();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveCounterTime = async (counter) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 변환
      const date = String(today.getDate()).padStart(2, '0'); // 일을 두 자리로 변환
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


  // useEffect를 사용하여 AsyncStorage에서 lastCountDate를 읽어옴
  useEffect(() => {
    retrieveLastCountDate(); // 컴포넌트가 마운트되면 AsyncStorage에서 값을 가져옴
  }, []); // 빈 배열로 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

  const retrieveLastCountDate = async () => {
    try {
      await AsyncStorage.removeItem('EXPO_CONSTANTS_INSTALLATION_ID'); //expo특정문자열 삭제용-임시
      const keys = await AsyncStorage.getAllKeys();
      // Filter keys to include only date-formatted keys
      const dateKeys = keys.filter((key) => moment(key, 'YYYY-MM-DD HH:mm:ss', true).isValid());
      if (dateKeys.length > 0) {
        dateKeys.sort(); // 키를 정렬하여 최신 값을 가져올 수 있도록 함
        const latestKey = dateKeys[dateKeys.length - 1]; // keys 배열에서 가장 마지막(최신) 키 가져오기
        const storedLastCountDate = await AsyncStorage.getItem(latestKey);
        if (storedLastCountDate !== null) {
          const date = latestKey.split(' ')[0]; // 날짜 부분 추출
          const time = latestKey.split(' ')[1]; // 시간 부분 추출
          setLastCountDate(`${date}\n   ${time}`);
        }
      } else {
        // AsyncStorage에 저장된 데이터가 없을 경우 처리
        console.log('No data found in AsyncStorage');
        setLastCountDate(`0`);
      }
    } catch (error) {
      console.error('Error retrieving lastCountDate:', error);
    }
  };

  // 경과시간을 보기좋게 만드는 함수
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

  useEffect(() => {
    calculateElapsedTime();
    const intervalId = setInterval(() => {
      calculateElapsedTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateElapsedTime = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const dateKeys = keys.filter((key) => moment(key, 'YYYY-MM-DD HH:mm:ss', true).isValid());

      if (dateKeys.length > 0) {
        dateKeys.sort(); // 키를 정렬하여 최신 값을 가져올 수 있도록 함
        const latestKey = dateKeys[dateKeys.length - 1]; // keys 배열에서 가장 마지막(최신) 키 가져오기
        const storedLastCountDate = await AsyncStorage.getItem(latestKey);
        if (storedLastCountDate !== null) {
          // const lastCountDateTime = moment(storedLastCountDate, 'YYYY-MM-DD HH:mm:ss');
          const currentTime = moment();
          const diffInSeconds = currentTime.diff(latestKey, 'seconds');
          setElapsedTime(diffInSeconds);
        }
      } else {
        // AsyncStorage에 저장된 데이터가 없을 경우 처리
        console.log('No data found in AsyncStorage');
        setElapsedTime(0); // 데이터가 없으므로 경과 시간을 0으로 설정
        clearAllData();
      }
    } catch (error) {
      console.error('Error calculating elapsedTime:', error);
    }
  };

  //그래프를 좌우로 넘기는 함수
  const swipeRight = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
      fetchWeeklyData();
    }
  };

  const swipeLeft = () => {
    if (currentWeekIndex < weeksData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
      fetchWeeklyData();
    }
  };

  //////////////////////////////////////////////////////////////수동입력박스
  // const handleInputChange = (text) => {
  //   setInputCount(parseInt(text, 10));
  // };

  // const handleDateChange = (text) => {
  //   setInputDate(text);
  // };

  const handleDateChange = (text) => {
    // 사용자가 '-'를 입력한 경우 무시하고 그대로 출력
    if (text.endsWith('-')) {
      setInputDate(text);
      return;
    }

    // 입력된 텍스트에 '-' 제거
    const formattedText = text.replace(/-/g, '');

    // 'YYYYMMDD' 형식으로 입력이 된 경우, 'YYYY-MM-DD' 형식으로 변환하여 출력
    if (formattedText.length <= 4) {
      setInputDate(formattedText);
    } else if (formattedText.length <= 6) {
      setInputDate(formattedText.slice(0, 4) + '-' + formattedText.slice(4));
    } else {
      setInputDate(
        formattedText.slice(0, 4) +
        '-' +
        formattedText.slice(4, 6) +
        '-' +
        formattedText.slice(6, 8)
      );
    }
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
      // 입력 완료 후 입력값 초기화
      fetchWeeklyData(); //저장시 그래프 업데이트
      setInputCount('');
      setInputDate('');
      bottomSheetModalRef.current?.close(); // Bottom Sheet 닫기
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  const handleCloseBottomSheet = () => {
    // 입력값들을 초기화합니다.
    setInputCount('');
    setInputDate('');
    // Bottom Sheet를 닫습니다.
    bottomSheetModalRef.current?.close();
  };

  // // ref    바텀시트사용을 위한 코드
  // const bottomSheetRef = useRef < BottomSheet > (null);
  // // variables
  // const snapPoints = useMemo(() => ['25%', '50%'], []);
  // // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const clearAllData = async () => {
    try {
      // await AsyncStorage.clear(); // AsyncStorage에서 모든 데이터 삭제
      setCounter(0); // 카운터 초기화
      setCounterYesterday(0); // 어제 카운터 초기화
      setLastCountDate(null); // 최종 흡연 날짜 초기화
      setElapsedTime(null); // 경과 시간 초기화
      setDailyData([]); // 일별 데이터 초기화
      setWeeksData([]); // 주별 데이터 초기화
      setCurrentWeekIndex(0); // 현재 주 인덱스 초기화
      setInputCount(0); // 수동 입력 카운트 초기화
      setInputDate(''); // 수동 입력 날짜 초기화
      // 필요한 상태값을 모두 초기화해줍니다.

      // 또는 useEffect에서 호출하는 함수들을 통해 초기화할 수도 있습니다.
      // fetchWeeklyData(); // 주간 데이터 초기화 함수 호출
      // retrieveLastCountDate(); // 마지막 흡연 날짜 초기화 함수 호출
      // calculateElapsedTime(); // 경과 시간 초기화 함수 호출
      // 등등...

      // 초기화 후 다시 데이터를 가져올 수 있는 함수 호출
      retrieveCount();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const chartHeight = Platform.OS === 'android' ? 200 : 300; // 안드로이드와 iOS의 높이 차이 적용

  return (
    <GestureHandlerRootView style={{ flex: 1, }}>
      <View style={styles.container} >
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
              // friction={2}
              // leftThreshold={40}
              // rightThreshold={40}
              friction={20}
              leftThreshold={100}
              rightThreshold={100}
              renderLeftActions={() => (
                <View style={{ marginHorizontal: -20 }}>
                  {/* <Text style={{ textAlign: 'center' }}>전주</Text> */}
                  <TouchableOpacity onPress={swipeLeft}>
                    <BarChart
                      data={{
                        labels: weeksData[currentWeekIndex]?.map((entry) => moment(entry.date).format('MM/DD')) || [],
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
                        backgroundColor: '#ebedee',
                        backgroundGradientFrom: '#ebedee',
                        backgroundGradientTo: '#ebedee',
                        decimalPlaces: 0,
                        propsForLabels: { fontSize: 12, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
                        color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      bezier
                      style={{
                        marginVertical: 8,
                        // borderRadius: 16,
                        // marginHorizontal: -20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              renderRightActions={() => (
                <View style={{ marginHorizontal: -20 }}>
                  {/* <Text style={{ textAlign: 'center' }}>다음주</Text> */}
                  <TouchableOpacity onPress={swipeRight}>
                    <BarChart
                      data={{
                        labels: weeksData[currentWeekIndex]?.map((entry) => moment(entry.date).format('MM/DD')) || [],
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
                        backgroundColor: '#ebedee',
                        backgroundGradientFrom: '#ebedee',
                        backgroundGradientTo: '#ebedee',
                        decimalPlaces: 0,
                        propsForLabels: { fontSize: 12, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
                        color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      bezier
                      style={{
                        marginVertical: 8,
                        // borderRadius: 16,
                        // marginHorizontal: -20,
                      }}
                    />
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
              <View style={{ marginHorizontal: -20 }}>
                {/* <Text style={{ textAlign: 'center' }}>일별</Text> */}
                <BarChart
                  data={{
                    labels: weeksData[currentWeekIndex]?.map((entry) => moment(entry.date).format('MM/DD')) || [],
                    datasets: [
                      {
                        data: weeksData[currentWeekIndex]?.map((entry) => entry.value) || [],
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width}
                  height={chartHeight}
                  yAxisSuffix=""
                  // yAxisInterval={100} // optional, defaults to 1
                  fromZero
                  withInnerLines
                  // verticalLabelRotation={-90}
                  showValuesOnTopOfBars
                  chartConfig={{
                    backgroundColor: '#ebedee',
                    backgroundGradientFrom: '#ebedee',
                    backgroundGradientTo: '#ebedee',
                    decimalPlaces: 0,
                    propsForLabels: { fontSize: 12, margin: 0, fontWeight: 'bold' }, // Establece margin en 0 o null
                    color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    // borderRadius: 16,
                    // marginHorizontal: -20,
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
                    // onChangeText={(text) => setInputDate(text)}
                    onChangeText={handleDateChange}
                    value={inputDate}
                    keyboardType="number-pad"
                    placeholder="YYYYMMDD 자동으로 -이 생성됩니다"
                  />
                  <Button title="입력" onPress={handleManualCountSubmit} />
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={handleCloseBottomSheet}>
                  {/* 닫기 버튼 */}
                  <Text style={styles.closeButton}>닫기</Text>
                  {/* <Button title="닫기" onPress={handleManualCountSubmit} /> */}
                </TouchableOpacity>
              </View>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'column', // 수평으로 나열되도록 설정
    width: '100%', // 부모 View의 너비를 화면 크기에 맞추기 위해 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
  },
  SectionContainer: {
    flexDirection: 'row', // 수평으로 나열되도록 설정
    justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    backgroundColor: '#ebedee',
    borderRadius: 10,
    margin: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row', // 수평으로 나열되도록 설정
    paddingHorizontal: 10, // 텍스트 박스 간 간격을 조절할 수 있는 여백 설정
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 10,
  },
  counterText: {
    fontSize: 15,
    color: '#3333ff', // 글자 색상
    marginBottom: -15,
  },
  counter: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: '500',
    color: '#333', // 글자 색상
  },
  counterValue: {//증감텍스트는 별도로 셋팅
    fontSize: 30,
    fontWeight: '500',
    color: '#333', // 글자 색상
  },
  graphContainer: {
    // flex: 1,
    // flexDirection: 'row', // 수평으로 나열되도록 설정
    // justifyContent: 'space-between', // 각 섹션을 좌우로 나란히 배치
    // backgroundColor: '#ede4e4',
    // borderWidth: 1,
    // borderColor: 'lightgray',
    // margin: 10,
    marginLeft: 10,
    marginRight: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: -80,
  },
  buttonContainer: {
    borderRadius: 8,
    alignItems: 'center',
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
  },
  circularButtonInput: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#4f4f64',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  closeButton: {
    borderColor: 'gray',
    textAlign: 'right',
    fontSize: 18,
    color: 'gray',
    paddingHorizontal: 10,
  },

  androidSpecificStyle: {
    // 안드로이드 전용 스타일
    ...Platform.select({
      android: {
        // 안드로이드 전용 스타일 지정
      },
    }),
  },
  iosSpecificStyle: {
    // iOS 전용 스타일
    ...Platform.select({
      ios: {
        // iOS 전용 스타일 지정
      },
    }),
  },

});


export default HomeScreen;
// export const retrieveCount = () => {};
// export const clearAllData = () => {};
// export { clearAllData }; // 함수 내보내기
