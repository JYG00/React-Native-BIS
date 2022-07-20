import React, { useEffect, useState } from 'react';
import { BusStopSch, BusSch } from './component/search/search';
import Favorites from './component/favorites/favorites';
import { Arrive } from './component/arrive/arrvie';
import { Home } from './component/home/home';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, BackHandler, Alert, TouchableOpacity } from 'react-native';
import { LogBox } from 'react-native';
import storage from './component/storage/storage';
import { setColors, getColors } from './component/colors/color';
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
  // 테마 색상 배열 (기본 테마 : Blue)
  const colorArr = ['Red', 'Green', 'Blue', 'Pink', 'Grey'];
  // 테마가 색상이 들어갈 공간
  const [themeColor, setThemeColor] = useState();
  // route간 이동하기 위함
  const nav = useNavigation();
  // 준비가 끝난뒤 렌더링
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    storage
      .load({
        key: 'userThemeColor',
        id: '1',

        autoSync: true,

        syncInBackground: true,

        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((ret) => {
        setColors(`${ret.themeColor}`);

        let themeColorList = [];
        getColors().map((colorCode) => colorCode.map((code) => themeColorList.push(code)));

        setThemeColor(themeColorList);
        setIsReady(true);
      })
      .catch((err) => {
        // console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // 유저가 테마를 선택하지 않은 경우 기본 테마 (Blue) 적용
            setColors('Blue');

            let themeColorList = [];
            getColors().map((colorCode) => colorCode.map((code) => themeColorList.push(code)));

            setThemeColor(themeColorList);
            setIsReady(true);
            break;
          case 'ExpiredError':
            break;
        }
      });
  }, []);

  // 테마 변경하기 클릭 시
  const onSelect = (selectedItem, index) => {
    setColors(selectedItem);
    // 기존에 있던 테마를 제거
    storage.remove({
      key: 'userThemeColor',
      id: '1',
    });
    // 유저가 선택한 테마 적용
    storage.save({
      key: 'userThemeColor',
      id: '1',
      data: {
        themeColor: selectedItem,
      },
    });
    // 테마 색상을 담는 임시 공간
    let themeColorList = [];
    getColors().map((colorCode) => colorCode.map((code) => themeColorList.push(code)));
    setThemeColor(themeColorList);
  };

  const onPress = () => {
    nav.navigate(value, { themeColor: themeColor });
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
