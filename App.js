import React, { useEffect, useState } from 'react';
import { BusStopSch, BusSch } from './component/search/search';
import Favorites from './component/favorites/favorites';
import { Arrive } from './component/arrive/arrvie';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { LogBox } from 'react-native';
// icons
import { Ionicons } from '@expo/vector-icons';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const Stack = createNativeStackNavigator();

// 홈 화면
export default function App() {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('알림', '앱을 종료하시겠습니까?', [
        {
          text: '취소',
          onPress: () => null,
        },
        { text: '확인', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="홈">
        <Stack.Screen
          name="홈"
          component={Favorites}
          options={{
            headerLeft: () => <Sch value={'정류소 검색'} />,
            headerRight: () => <Sch value={'버스 검색'} />,
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="정류소 검색" component={BusStopSch} />
        <Stack.Screen name="버스 검색" component={BusSch} />
        <Stack.Screen name="즐겨찾기" component={Favorites} />
        <Stack.Screen name="도착시간" component={Arrive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 검색
export function Sch({ value }) {
  const nav = useNavigation();

  const onPress = () => {
    nav.navigate(value);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.navBox}>
      <Text>{value}</Text>
      <Ionicons name="ios-search" size={24} style={{ marginLeft: 5 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navBox: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
