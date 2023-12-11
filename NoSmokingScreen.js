import React, { useState, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// import { startTimer } from './NSProgressScreen';
// import NSProgressScreen from './NSProgressScreen';
// import { startTimer } from './NSProgressScreen';

const SmokingCessationApp = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  // const [progress, setProgress] = useState(0);
  // const [timerRunning, setTimerRunning] = useState(false);

  // const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const MoveToProgressScreen = () => {
    navigation.navigate('NSProgressScreen', { functionName: startTimer }); // 'NSProgress'는 다른 스크린(페이지)의 이름
  }

  const MoveToProgressScreenWithParam = () => {

    const selectedDate = new Date(`${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}T${selectedHour.padStart(2, '0')}:00:00`);
    // console.log(selectedDate);
    
    // 현재 날짜와 선택한 날짜 사이의 차이를 계산하여 타이머 시작 시간으로 설정
    const currentTime = new Date().getTime();
    const selectedTime = selectedDate.getTime();
    const timeDifference = selectedTime - currentTime;

    // 선택한 날짜가 현재 시간보다 이전인 경우에만 타이머 시작
    if (timeDifference < 0) {
      // startTimer(timeDifference);
      // startTimer(-timeDifference);
      
      // 타이머가 시작되면 NSProgressScreen으로 이동
      // navigation.navigate('NSProgressScreen', { functionName: startTimer(timeDifference) });
      // navigation.navigate('NSProgressScreen', { functionName: startTimer });
      navigation.navigate('NSProgressScreen', { selectedDate });
      // console.log(timeDifference);
      toggleModal(); // 모달 닫기
    } else {
      alert('유효한 날짜를 선택해주세요.');
      toggleModal(); // 모달 닫기
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons style={styles.iconText} name="smoke-free" size={24} color="black" />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.explainContainer}>
          <Text style={styles.explainText}>금연을 시작하고 건강 상태 변화를 알아보세요</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={MoveToProgressScreen}>
          <Text style={styles.buttonText}>지금부터 금연시작</Text>
        </TouchableOpacity>
        <View style={styles.explainContainer}>
          <Text style={styles.explainText}>이미 금연중이라면</Text>
        </View>
        <TouchableOpacity style={[styles.button, styles.secondButton]} onPress={toggleModal}>
          <Text style={styles.buttonText}>금연 시작 날짜 설정하기</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.explainText}>금연 시작 날짜 설정</Text>
            <Text>금연 시작 날짜를 선택해주세요.</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={selectedYear}
                onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
                itemStyle={styles.pickerItem}>
                {Array.from({ length: 21 }, (_, index) => {
                  const year = 2010 + index;
                  return <Picker.Item key={index} label={`${year}`} value={`${year}`} />;
                })}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedMonth}
                onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
                itemStyle={styles.pickerItem}>
                {Array.from({ length: 12 }, (_, index) => {
                  const month = index + 1;
                  return <Picker.Item key={index} label={`${month}월`} value={`${month}`} />;
                })}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedDay}
                onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
                itemStyle={styles.pickerItem}>
                {Array.from({ length: 31 }, (_, index) => {
                  const day = index + 1;
                  return <Picker.Item key={index} label={`${day}일`} value={`${day}`} />;
                })}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedHour}
                onValueChange={(itemValue, itemIndex) => setSelectedHour(itemValue)}
                itemStyle={styles.pickerItem}>
                {Array.from({ length: 25 }, (_, index) => {
                  return <Picker.Item key={index} label={`${index}시`} value={`${index}`} />;
                })}
              </Picker>
            </View>
            <TouchableOpacity onPress={toggleModal} >
              <Text style={styles.modalCloseText} onPress={MoveToProgressScreenWithParam}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 150,
  },
  buttonContainer: {
    marginBottom: 50,
    width: '80%',
  },
  explainContainer: {
    alignItems: 'center',
  },
  explainText: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    marginBottom: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    // width: 500,
    flexDirection: 'row', // Picker 요소들을 가로로 나열
    justifyContent: 'space-between', // 가로 방향으로 공간을 동일하게 분배하여 요소 배치
    alignItems: 'center', // 요소들을 세로 방향에서 가운데로 정렬
  },
  picker: {
    width: '35%', // 필요에 따라 조절 가능한 너비
  },
  pickerItem: {
    fontSize: 15, // 원하는 글꼴 크기로 조정
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'blue',
  },
});

export default SmokingCessationApp;
