import React, { useEffect, useState } from 'react';
import { BusStopSch, BusSch } from './component/search/search';
import Favorites from './component/favorites/favorites';
import { Arrive } from './component/arrive/arrvie';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView,FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { setColors, getColors } from './component/colors/color';
import { LinearGradient } from 'expo-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import storage from './component/storage/storage';

// 홈 화면
export function Home() {

  // 테마 color (기본 테마 : Pink)
  const colorArr = ['Pink', 'Gray', 'Blue', 'Green'];
  const [themeColor, setThemeColor] = useState();
  // userBstopList
  const [userBstopList,setUserBstopList] = useState([]);
  // 
  const navigation = useNavigation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    storage
  .load({
    key: 'userThemeColor',
    id:'1',

    autoSync: true,

    syncInBackground: true,

    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
    setColors(`${ret.themeColor}`);

    let themeColorList = [];
    getColors().map((colorCode) => colorCode.map((code) => themeColorList.push(code)));

    setThemeColor(themeColorList);
    setIsReady(true);
  })
  .catch(err => {
    console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        break;
      case 'ExpiredError':
        break;
    }
  });

  storage
  .load({
    key: 'userBstop',
    id:'2',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
    setUserBstopList(ret);
  })
  .catch(err => {
    switch (err.name) {
      case 'NotFoundError':
        console.log('notFound');
        break;
      case 'ExpiredError':
        break;
    }
  });
  }, []);

  
    const renderItem = ({ item }) => {
   
      const onPress = () => {
        navigation.navigate('도착시간', { id: item.BstopId, name:item.BstopName,themeColor: themeColor });
      }

      return (
        <TouchableOpacity onPress={onPress}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={styles.content}>
            <Text style={{ fontSize: 20, color: '#555', fontWeight: '600' }}>{item.BstopId}</Text>
            <Text style={{ fontSize: 20, color: '#555', fontWeight: '600' }}>{item.BstopName}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };
  

  return (
    isReady && (
      <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
        {/* 검색 버튼 */}
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={styles.nav}>
          <NavButton props={'정류소 검색'} themeColor={themeColor} />
          <NavButton props={'버스 검색'} themeColor={themeColor} />
        </LinearGradient>
        {/* 테마 변경하기 */}
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={[styles.content_top, { borderColor: themeColor[2], marginVertical: 20 }]}>
          <SelectDropdown
            buttonStyle={{ backgroundColor: 'transparent', width: '100%' }}
            buttonTextStyle={styles.HomeText}
            defaultButtonText="테마 변경하기"
            data={colorArr}
            rowTextStyle={{ color: '#fff', fontWeight: 'bold' }}
            dropdownStyle={{ backgroundColor: themeColor[7] }}
            onSelect={(selectedItem, index) => {
              setColors(selectedItem);

              storage.remove({
                key: 'userThemeColor',
                id:'1',
              });

              storage.save({key:'userThemeColor',id:'1',data:{
                themeColor:selectedItem
              }})

              let themeColorList = [];
              getColors().map((colorCode) => colorCode.map((code) => themeColorList.push(code)));

              setThemeColor(themeColorList);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          ></SelectDropdown>
        </LinearGradient>
        {/* 즐겨찾기 */}
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={[styles.content_bottom, { borderColor: themeColor[2] }]}>
          <View>
            <Text style={[styles.HomeText, { paddingVertical: 10 }]}>즐겨찾기 목록</Text>
          </View>
        </LinearGradient>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={[styles.content_bottom, { borderColor: themeColor[2], marginVertical: 5 }]}>
          <View>
            {userBstopList.length!==0?
            (<View>
                <FlatList data={userBstopList} renderItem={renderItem} keyExtractor={(item,index)=>index}/>
            </View>)
            :
            (<Text style={[styles.HomeText, { paddingVertical: 10 }]}>추가된 목록이 없습니다</Text>)}
          </View>
        </LinearGradient>
      </View>
    )
  );
}

// 네비 버튼
export function NavButton({ props, themeColor }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(`${props}`, { themeColor: themeColor });
  };

  let keyword = null;

  switch (props) {
    case '정류소 검색':
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
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.navBox, { borderColor: themeColor[2] }]} onPress={onPress}>
        <Text style={styles.HomeText}>{keyword}</Text>
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
        <Stack.Screen name="정류소 검색" component={BusStopSch} />
        <Stack.Screen name="버스 검색" component={BusSch} />
        <Stack.Screen name="즐겨찾기" component={Favorites} />
        <Stack.Screen name="도착시간" component={Arrive} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  nav: {
    height: 90,
    flexDirection: 'row',
  },
  navBox: {
    borderWidth: 1,
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HomeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  content_top: {
    padding: 10,
    height: 60,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content_bottom: {
    height: 'auto',
    padding: 10,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content:{
    
      width: '100%',
      height: 80,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fafafa',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
  
      elevation: 7,
      color: '#888',
      borderColor: '#888',
      marginBottom: 10,
      paddingLeft: 20,
      paddingTop: 10,
    },
  });
