import React from 'react';
import { BusStopSch, BusSch } from './component/search/search';
import { Favorites } from './component/favorites/favorites';
import { Arrive } from './component/arrive/arrvie';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// 홈 화면
export function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* 상태표시줄 공백 */}
      <View style={{ height: 50 }}></View>
      <View style={styles.nav}>
        <NavButton props={'정류장 검색'} />
        <NavButton props={'버스 검색'} />
        <NavButton props={'즐겨찾기'} />
      </View>
    </ScrollView>
  );
}

// 네비 버튼
export function NavButton({ props }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(`${props}`);
  };

  let keyword = null;

  switch (props) {
    case '정류장 검색':
      keyword = '정류소 검색';
      break;
    case '버스 검색':
      keyword = '버스 검색';
      break;
    case '즐겨찾기':
      keyword = '즐겨찾기';
      break;
    default:
      break;
  }

  return (
    <View>
      <TouchableOpacity style={styles.navBox} onPress={onPress}>
        <Text style={styles.navText}>{keyword}</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="홈">
        <Stack.Screen name="홈" component={Home} />
        <Stack.Screen name="정류장 검색" component={BusStopSch} />
        <Stack.Screen name="버스 검색" component={BusSch} />
        <Stack.Screen name="즐겨찾기" component={Favorites} />
        <Stack.Screen name="도착시간" component={Arrive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  navBox: {
    width: 130,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
});
