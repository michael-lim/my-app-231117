import React, { useState, } from 'react';
import { View, Text, StyleSheet, Linking, Modal, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import { Picker } from '@react-native-picker/picker';
// import clearAllData  from './HomeScreen';

const SettingsScreen = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const resetSmokingRecords = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 ISO 형식으로 변환하여 "YYYY-MM-DD" 형태의 문자열로 가져옴
      const keys = await AsyncStorage.getAllKeys(); // 모든 AsyncStorage 키를 가져옴
      const recordsToDelete = keys.filter(key => key.includes(currentDate)); // 현재 날짜를 포함하는 모든 키를 찾음
      if (recordsToDelete.length > 0) {
        Alert.alert(
          '경고',
          '흡연 기록을 초기화하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: async () => {
                await AsyncStorage.multiRemove(recordsToDelete); // 해당하는 모든 키에 대한 데이터 삭제
                alert('흡연 기록이 성공적으로 초기화되었습니다.');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert('흡연 기록이 없습니다.');
      }
    } catch (error) {
      console.error('Error resetting smoking records:', error);
    }
  };

  const resetNoSmokingRecords = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // 모든 AsyncStorage 키를 가져옴
      const recordsToDelete = keys.filter(key => key.includes('noSmoking')); // 'noSmoking' 문자열을 포함하는 모든 키를 찾음
      if (recordsToDelete.length > 0) {
        Alert.alert(
          '경고',
          '금연 기록을 초기화하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: async () => {
                await AsyncStorage.multiRemove(recordsToDelete); // 해당하는 모든 키에 대한 데이터 삭제
                alert('금연 기록이 성공적으로 초기화되었습니다.');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert('금연 기록이 없습니다.');
      }
    } catch (error) {
      console.error('Error resetting no smoking records:', error);
    }
  };

  const resetAllRecords = async () => {
    try {
      Alert.alert(
        '경고',
        '모든 기록을 초기화하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: async () => {
              await AsyncStorage.clear(); // AsyncStorage에 저장된 모든 데이터를 초기화
              // HomeScreen.clearAllData(); // A스크린에서 가져온 clearAllData 함수 실행
              alert('성공적으로 모든 기록이 초기화되었습니다.');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error resetting counters:', error);
    }
  };

  const sendEmail = () => {
    const email = 'service@eurogamez.eu';
    MailComposer.composeAsync({
      recipients: [email],
      subject: '사용자 문의', // 이메일 제목
      body: '앱에 대한 문의 또는 개선사항을 작성해주세요.', // 이메일 내용
    })
      .then(result => {
        if (result.status === 'sent') {
          console.log('Email sent!');
        } else {
          console.log('Email not sent');
        }
      })
      .catch(error => console.error('Error sending email:', error));
  };

  const joinKakaoTalkGroup = () => {
    // 카카오톡 단톡방 링크
    // const kakaoTalkLink = 'kakaotalk://';
    const kakaoTalkLink = 'https://open.kakao.com/o/s6J7cqXf';
    Linking.canOpenURL(kakaoTalkLink).then(supported => {
      if (supported) {
        Linking.openURL(kakaoTalkLink);
      } else {
        alert('카카오톡 앱이 설치되어 있지 않습니다.');
      }
    });
  };

  const openAppStoreForReview = () => {
    const appId = Platform.OS === 'ios' ? 'YOUR_IOS_APP_ID' : 'YOUR_ANDROID_PACKAGE_NAME';
    const storeUrl = Platform.OS === 'ios'
      ? `https://apps.apple.com/app/id${appId}?action=write-review`
      : `market://details?id=${appId}`;
    Linking.openURL(storeUrl).catch(() => {
      alert('리뷰를 작성할 수 있는 스토어 페이지를 열 수 없습니다.');
    });
  };

  const openOpenSourceLicensePage = () => {
    // const openSourceLicenseUrl = 'YOUR_OPEN_SOURCE_LICENSE_URL';
    const openSourceLicenseUrl = 'https://eurogamez.eu';
    Linking.openURL(openSourceLicenseUrl).catch(() => {
      alert('오픈소스 라이선스 페이지를 열 수 없습니다.');
    });
  };


  const updateNoSmokingDate = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // 모든 AsyncStorage 키를 가져옴
      const recordsToDelete = keys.filter(key => key.includes('noSmoking')); // 'noSmoking' 문자열을 포함하는 모든 키를 찾음
      if (recordsToDelete.length > 0) {
        await AsyncStorage.setItem('noSmoking', formattedDate);
        alert('금연 시작 날짜가 업데이트되었습니다.');
        toggleModal(); // 모달 닫기
      } else {
        alert('금연 기록이 없습니다.');
      }
    } catch (error) {
      console.error('Error resetting no smoking records:', error);
      toggleModal(); // 모달 닫기
    }
  };

  const handleOptionPress = (option) => {
    // 각 메뉴에 대한 기능 처리
    switch (option) {
      case '흡연 기록 초기화':
        // 흡연 기록 초기화 기능 처리
        resetSmokingRecords();
        break;
      case '금연 기록 초기화':
        // 금연 기록 초기화 기능 처리
        resetNoSmokingRecords();
        break;
      case '모든 기록 초기화':
        // 모든 기록 초기화 기능 처리
        resetAllRecords();
        break;
      case '금연 시작 날짜 변경':
        // 금연 시작 날짜 변경 기능 처리
        toggleModal();
        break;
      case '메일로 문의하기':
        // 메일로 문의하기 기능 처리
        sendEmail();
        break;
      case '카카오톡 단톡방 참여하기':
        // 카카오톡 단톡방 참여하기 기능 처리
        joinKakaoTalkGroup();
        break;
      case '앱 리뷰하기':
        // 앱 리뷰하기 기능 처리
        openAppStoreForReview();
        break;
      case '오픈소스 라이선스':
        // 오픈소스 라이선스 페이지로 이동
        openOpenSourceLicensePage();
        break;
      default:
        break;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>초기화</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('흡연 기록 초기화')}>흡연 기록 초기화</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('금연 기록 초기화')}>금연 기록 초기화</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('모든 기록 초기화')}>모든 기록 초기화</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 정보</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('금연 시작 날짜 변경')}>금연 시작 날짜 변경</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>문의 및 개선사항</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('메일로 문의하기')}>메일로 문의하기</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('카카오톡 단톡방 참여하기')}>카카오톡 단톡방 참여하기</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>리뷰</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('앱 리뷰하기')}>앱 리뷰하기</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>앱 정보</Text>
            <Text style={styles.optionText} onPress={() => handleOptionPress('오픈소스 라이선스')}>오픈소스 라이선스</Text>
            <Text style={styles.versionText}>앱버전: 1.0.0</Text>
          </View>
        </View>

        {/* 모달 */}
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
              <Text style={styles.explainText}>금연 시작 날짜 변경</Text>
              <Text>금연 시작 변경 날짜를 선택해주세요.</Text>
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
              <View style={styles.modalCloseBox}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>취소</Text>
                </TouchableOpacity>
                <View style={{ width: 100 }} />
                <TouchableOpacity onPress={toggleModal} >
                  <Text style={styles.modalCloseText} onPress={updateNoSmokingDate}>완료</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // ScrollView의 배경색을 지정하여 회색 화면이 보이지 않게 함
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20, // 텍스트 크기 조정
    fontWeight: 'bold',
    marginBottom: 20, // 줄 간격 조정
  },
  optionText: {
    fontSize: 18, // 텍스트 크기 조정
    marginBottom: 15, // 줄 간격 조정
    // color: 'blue', // 버튼처럼 보이게 하기 위해 색상 추가
  },
  versionText: {
    fontSize: 18, // 텍스트 크기 조정
    marginTop: 5, // 줄 간격 조정
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
  modalCloseBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }
});

export default SettingsScreen;
// export const resetCounters = () => {};