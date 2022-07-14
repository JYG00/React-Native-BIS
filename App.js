import React from 'react';
import { BusStopSch, BusSch } from './component/search/search';
import Favorites from './component/favorites/favorites';
import { Arrive } from './component/arrive/arrvie';
import { Home } from './component/home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo } from '@expo/vector-icons';
import { View, Text } from 'react-native-web';

const Stack = createNativeStackNavigator();

export default function App() {
  const arriveHeader = (
    <View>
      <Entypo name="home" size={24} color="black" />
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="홈">
        <Stack.Screen name="홈" component={Home} />
        <Stack.Screen name="정류소 검색" component={BusStopSch} />
        <Stack.Screen name="버스 검색" component={BusSch} />
        <Stack.Screen name="즐겨찾기" component={Favorites} />
        <Stack.Screen name="도착시간" component={Arrive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
