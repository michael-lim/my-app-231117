// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { PieChart } from 'react-native-chart-kit';
// import moment from 'moment';

// const NoSmokingScreen = () => {
//   const stages = [
//     { label: '20분', duration: 20 },
//     { label: '12시간', duration: 12 * 60 },
//     { label: '3개월', duration: 3 * 30 * 24 * 60 },
//     { label: '9개월', duration: 9 * 30 * 24 * 60 },
//     { label: '1년', duration: 365 * 24 * 60 },
//     { label: '5년', duration: 5 * 365 * 24 * 60 },
//     { label: '10년', duration: 10 * 365 * 24 * 60 },
//     { label: '15년', duration: 15 * 365 * 24 * 60 },
//   ];

//   const [elapsedMinutes, setElapsedMinutes] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setElapsedMinutes((prevMinutes) => prevMinutes + 1);
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   const charts = stages.map((stage, index) => {
//     const currentStageIndex = index;
//     const currentStage = stages[currentStageIndex];

//     const data = stages.map((stage, i) => ({
//       name: stage.label,
//       value: i <= currentStageIndex ? 1 : 0,
//       color: i <= currentStageIndex ? `rgba(0, 128, 0, 0.6)` : `rgba(211, 211, 211, 0.6)`,
//     }));

//     return (
//       <View key={index} style={{ alignItems: 'center', marginTop: 20 }}>
//         <Text>{currentStage.label} 경과 상황</Text>
//         <PieChart
//           data={data}
//           width={200}
//           height={200}
//           chartConfig={{
//             backgroundGradientFrom: '#1E2923',
//             backgroundGradientTo: '#08130D',
//             color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
//           }}
//           accessor="value"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </View>
//     );
//   });

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       {charts}
//     </View>
//   );
// };

// export default NoSmokingScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import moment from 'moment';

const NoSmokingScreen = () => {
  const stages = [
    { label: '20분', duration: 20 },
    { label: '12시간', duration: 12 * 60 },
    { label: '3개월', duration: 3 * 30 * 24 * 60 },
    { label: '9개월', duration: 9 * 30 * 24 * 60 },
    { label: '1년', duration: 365 * 24 * 60 },
    { label: '5년', duration: 5 * 365 * 24 * 60 },
    { label: '10년', duration: 10 * 365 * 24 * 60 },
    { label: '15년', duration: 15 * 365 * 24 * 60 },
  ];

  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    // 특정 시간 간격마다 elapsedMinutes 갱신
    const interval = setInterval(() => {
      setElapsedMinutes((prevMinutes) => prevMinutes + 1);
    }, 60000); // 1분마다 증가하도록 설정 (밀리초 단위)

    return () => clearInterval(interval); // 컴포넌트가 unmount될 때 interval clear
  }, []);

  const currentStageIndex = stages.findIndex((stage) => elapsedMinutes < stage.duration);


  const data = stages.map((stage, index) => ({
    name: stage.label,
    value: index <= currentStageIndex ? 1 : 0,
    color: index <= currentStageIndex ? `rgba(0, 128, 0, 0.6)` : `rgba(211, 211, 211, 0.6)`,
  }));

  // const charts = stages.map((stage, index) => {
  //   const currentStageIndex = index;
  //   const currentStage = stages[currentStageIndex];

  //   const data = stages.map((stage, i) => ({
  //     name: stage.label,
  //     value: i <= currentStageIndex ? 1 : 0,
  //     color: i <= currentStageIndex ? `rgba(0, 128, 0, 0.6)` : `rgba(211, 211, 211, 0.6)`,
  //   }));
  // });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ marginBottom: 20 }}>금연을 시작하고 지난 시간: {elapsedMinutes}분</Text>
      <PieChart
        data={data}
        width={450}
        height={300}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <Text style={{ marginTop: 20 }}>
        {currentStageIndex === -1 ? '모든 단계를 완료하셨습니다!' : `현재 ${stages[currentStageIndex].label} 단계입니다.`}
      </Text>
      <Button title="금연 시작" onPress={() => setElapsedMinutes(0)} />
    </View>
  );
};

export default NoSmokingScreen;
