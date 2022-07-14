import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../storage/storage';
import { useNavigation } from '@react-navigation/native';

// 즐겨찾기 페이지
export default function Favorites({ route }) {
  // 넘겨받은 테마 색상
  const [themeColor, setThemeColor] = useState(route.params.themeColor);
  // 즐겨찾기 목록
  const [favList, setFavlist] = useState([]);

  const navigation = useNavigation();

  // 비동기 저장소 불러오기
  useEffect(() => {
    storage
      .load({
        key: 'userBstop',
        id: '2',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((ret) => {
        setFavlist(ret);
      })
      .catch((err) => {
        switch (err.name) {
          case 'NotFoundError':
            console.log('notFound');
            break;
          case 'ExpiredError':
            break;
        }
      });
  }, []);

  // FlatList item
  const renderItem = ({ item }) => {
    const onPress = () => {
      navigation.reset({ routes: [{ name: '도착시간', params: { id: item.BstopId, name: item.BstopName, themeColor: themeColor } }] });
    };

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
    <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
      <View>
        {favList.length !== 0 ? (
          <View>
            <FlatList data={favList} renderItem={renderItem} keyExtractor={(item, index) => index} />
          </View>
        ) : (
          <Text style={[styles.HomeText, { paddingVertical: 10 }]}>추가된 목록이 없습니다</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  HomeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  content: {},
  favGrad: {
    height: 'auto',
    padding: 10,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
