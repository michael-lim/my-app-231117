import React, { useState, useEffect, useRef, } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Animated } from 'react-native';
// import { MainBottomTabNavigator} from './App';

const animatedValue = new Animated.Value(0);
animatedValue.addListener(() => {
  // empty listener
});


const NSProgressScreen = ({ route }) => {

  const functionName = route.params?.functionName;
  const { selectedDate } = route.params;

  const timerProgress = useRef(0); // useRef를 사용하여 타이머 진행 상태 저장

  const TimerChart = ({ duration, title, description, chartWidth = 190, chartHeight = 120, chartFontSize = 15, textFontSize = 15 }) => {

    const [progress, setProgress] = useState(0);

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setProgress((prevProgress) => {
    //       const newProgress = prevProgress + (100 / duration) * 1000;
    //       return newProgress >= 100 ? 100 : newProgress;
    //     });
    //   }, 1000);
    //   return () => clearInterval(interval);
    // }, [duration]);

    useEffect(() => {
      // console.log(selectedDate);
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = currentTime.getTime() - selectedDate.getTime(); // 시작 시간으로부터 경과한 시간

        if (elapsedTime >= duration) {
          setProgress(100);
          clearInterval(interval);
        } else {
          setProgress((elapsedTime / duration) * 100);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [duration]);

    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientTo: '#08130D',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    };

    const data = [
      {
        name: '',
        percentage: progress,
        color: '#00FF00',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: '',
        percentage: 100 - progress,
        color: '#FF0000',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.chartContainer}>
          <PieChart
            data={data}
            width={chartWidth} // 차트의 너비
            height={chartHeight} // 차트의 높이
            chartConfig={chartConfig}
            accessor="percentage"
            backgroundColor="transparent"
            hasLegend={false}
            style={{ fontSize: chartFontSize }} // 차트 텍스트 크기 조정
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.stepText, { fontSize: textFontSize }]} >{title}</Text>
          <Text style={[styles.descriptionText, { fontSize: textFontSize }]}>{description}</Text>
        </View>
      </View>
    );
  };

  const steps = [
    { duration: 20 * 60 * 1000, title: '1단계 20분', description: '혈압과 맥박이 정상으로 돌아오고 손발의 체온이 정상 수준으로 증가합니다' },
    { duration: 12 * 60 * 60 * 1000, title: '2단계 12시간', description: '혈액속 산소량이 정상으로 올라가고 일산화탄소 양도 정상으로 떨어집니다' },
    { duration: 3 * 30 * 24 * 60 * 60 * 1000, title: '3단계 3개월', description: '혈액순환이 좋아지고 폐기능이 눈에 띄게 좋아집니다' },
    { duration: 9 * 30 * 24 * 60 * 60 * 1000, title: '4단계 9개월', description: '기침이 줄어들고 숨쉬기 편안해지며 폐의 섬모가 정상기능을 찾아 여러가지 감염의 위험이 줄어듭니다' },
    { duration: 12 * 30 * 24 * 60 * 60 * 1000, title: '5단계 1년', description: '관상동맥질환에 걸릴 위험이 흡연자의 절반으로 감소합니다' },
    { duration: 5 * 365 * 24 * 60 * 60 * 1000, title: '6단계 5년', description: '금연후 5 ~ 15년이 지나면 중풍에 걸릴 위험이 비흡연자와 같아집니다' },
    { duration: 10 * 365 * 24 * 60 * 60 * 1000, title: '7단계 10년', description: '폐암 사망률이 흡연자의 절반 수준이 되며, 구강암, 후두암, 식도암, 방광암, 신장암, 췌장암의 발생위험도 감소합니다' },
    { duration: 15 * 365 * 24 * 60 * 60 * 1000, title: '8단계 15년', description: '관상동맥질환에 걸릴 위험이 비흡연자와 같아집니다' },
  ];


  // useEffect(() => {
  //   // 함수가 유효하면 호출
  //   if (typeof functionName === 'function') {
  //     startTimers();
  //   }
  // }, [functionName]);

  // const startTimers = () => {
  //   steps.forEach((step) => {
  //     startTimer(step.duration);
  //   });
  // };

  // const startTimer = (duration) => {
  //   // 타이머 로직
  //   // duration = duration - timeDifference;
  //   setTimerRunning(true);
  //   setProgress(0);

  //   // duration 값으로 타이머 시작 및 종료 설정
  //   setTimeout(() => setTimerRunning(false), duration * 1000);


  //   const timer = setTimeout(() => {
  //     setTimerRunning(false);
  //     setProgress(100); // 타이머가 종료될 때 프로그레스를 100%로 설정
  //     stopTimer(timer);
  //   }, duration);

  //   return timer;
  // };

  // // 타이머 중지 함수 (선택 사항)
  // const stopTimer = (timer) => {
  //   clearTimeout(timer); // setTimeout 반환 값으로 전달된 timer를 이용하여 타이머 중지
  // };


  const activeStep = steps.reduce((acc, curr) => {
    // 이미 종료된 단계는 제외
    const elapsedTime = new Date().getTime() - selectedDate.getTime();
    if (curr.duration > elapsedTime && curr.duration < acc.duration) {
      // if (curr.duration > 0 && curr.duration < acc.duration) {
      return curr;
    }
    return acc;
  }, { duration: Infinity }); // 가장 작은 duration으로 초기화

  return (
    <View style={styles.activeContainer}>
      <View style={styles.sectionTopContainer}>
        {activeStep.duration !== Infinity && (
          <View style={styles.chartTopContainer}>
            <TimerChart
              duration={activeStep.duration}
              title={activeStep.title}
              description={activeStep.description}
              chartFontSize={50} // 차트의 텍스트 크기 조정
              textFontSize={20} // 설명 텍스트의 크기 조정
              chartWidth={280} // 차트의 너비 조정
              chartHeight={170} // 차트의 높이 조정
            />
          </View>
        )}
      </View>
      <View>
        <Text style={styles.titleText}>금연후 신체 변화</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {steps.map((step, index) => (
          <TimerChart key={index} duration={step.duration} title={step.title} description={step.description} />
        ))}
      </ScrollView>
      {/* <MainBottomTabNavigator /> */}
    </View>


  );
};

const styles = StyleSheet.create({
  activeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  sectionTopContainer: {
    height: 300,
    // width: '100%',
    // flexDirection: 'row', // 파이차트와 텍스트를 가로로 나란히 배치하기 위한 flex-direction 설정
    justifyContent: 'space-around',
    // alignItems: 'center',
    // width: '50%', // 부모 View의 가로 너비에 맞게 설정
  },
  chartTopContainer: {
    // width: '100%',
    overflow: 'hidden', // 넘치는 부분을 숨김 처리
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionContainer: {
    flex: 1,
    flexDirection: 'row', // 파이차트와 텍스트를 가로로 나란히 배치하기 위한 flex-direction 설정
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ebedee',
    marginBottom: 10,
    borderRadius: 10,
  },
  chartContainer: {
    marginRight: 10,
    marginLeft: 25,
    backgroundColor: '#ebedee',
  },
  textContainer: {
    flexDirection: 'column', // 텍스트를 세로로 배치하기 위한 flex-direction 설정
    width: '65%', // 텍스트가 차지하는 영역을 그래프와 동일한 너비 설정
    marginLeft: -100, // 파이차트와 텍스트 사이 간격 조정
    backgroundColor: '#ebedee',
    padding: 10,
  },
  stepText: {
    color: 'blue', // 파란색으로 설정
    fontWeight: 'bold', // 볼드체 설정
  },
  descriptionText: {
    marginTop: 10, // 텍스트 간 간격 조정
  },
});

export default NSProgressScreen;
