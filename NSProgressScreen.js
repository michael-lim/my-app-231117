import React, { useState, useEffect } from 'react';
import { View, StyleSheet, } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useRoute } from '@react-navigation/native';

const NSProgressScreen = ({ }) => {

  const [timerRunning, setTimerRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const route = useRoute();

  const functionName = route.params?.functionName;
  useEffect(() => {
    // 함수가 유효하면 호출
    if (typeof functionName === 'function') {
      console.log("타이머 스타트!")
      startTimer();
    }
  }, [startTimer]);

  const steps = [
    20 * 60 * 1000, 
    12 * 60 * 60 * 1000, 
    3 * 30 * 24 * 60 * 60 * 1000, 
    9 * 30 * 24 * 60 * 60 * 1000,
    12 * 30 * 24 * 60 * 60 * 1000, 
    5 * 365 * 24 * 60 * 60 * 1000, 
    10 * 365 * 24 * 60 * 60 * 1000, 
    15 * 365 * 24 * 60 * 60 * 1000];

  const startTimer = () => {
    setTimerRunning(true);
    setProgress(0);
    setTimeout(() => setTimerRunning(false), 20 * 60 * 1000); // 20분 타이머 설정
  };

  useEffect(() => {
    
    const interval = setInterval(() => {
      if (timerRunning) {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + (100 / steps[currentStep]) * 1000;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, currentStep]);

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  const data = [
    {
      name: 'Complete',
      percentage: progress,
      color: '#00FF00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Remaining',
      percentage: 100 - progress,
      color: '#FF0000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const twelveHours = 12 * 60 * 60 * 1000; // 12시간
  const [secondProgress, setSecondProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / twelveHours) * 1000;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const secondData = [
    {
      name: 'Complete',
      percentage: secondProgress,
      color: '#00FF00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Remaining',
      percentage: 100 - secondProgress,
      color: '#FF0000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];
  
  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        width={300}
        height={200}
        chartConfig={chartConfig}
        accessor="percentage"
        backgroundColor="transparent"
        paddingLeft="15"
      />
      <PieChart
        data={secondData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        accessor="percentage"
        backgroundColor="transparent"
        paddingLeft="15"
      />
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
});

export default NSProgressScreen;
export function startTimer(){};