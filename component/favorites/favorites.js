import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { setColors, getColors } from '../colors/color';
import storage from '../storage/storage';
import { useNavigation } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';

// 즐겨찾기 페이지
export default function Favorites() {
  // 넘겨받은 테마 색상
  const [themeColor, setThemeColor] = useState();
  // 즐겨찾기 목록
  const [favList, setFavlist] = useState([]);
  // 렌더링 여부
  const [isReady, setIsReady] = useState(false);
  // 테마 색상 배열 (기본 테마 : Blue)
  const colorArr = ['Red', 'Green', 'Blue', 'Pink', 'Grey'];

  // 도착시간 컴포넌트로 이동
  const navigation = useNavigation();

  // 비동기 저장소 불러오기
  useEffect(() => {
    // 즐겨찾기 목록 가져오기
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
    // 테마 색깔 가져오기
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

  // 즐겨찾기 목록
  const renderItem = ({ item }) => {
    const onPress = () => {
      navigation.reset({ routes: [{ name: '도착시간', params: { id: item.BstopId, name: item.BstopName, themeColor: themeColor } }] });
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={styles.content}>
          <Text style={{ fontSize: 20, color: '#555', fontWeight: '600' }}>{item.BstopName}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    isReady && (
      <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
        <View>
          {/* 즐겨찾기 목록의 여부에 따라 다르게 렌더링 */}
          {favList.length !== 0 ? (
            <View>
              <FlatList data={favList} renderItem={renderItem} keyExtractor={(item, index) => index} />
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Text style={[styles.HomeText, { color: themeColor[1] }]}>즐겨찾기에 추가된 목록이 없습니다</Text>
            </View>
          )}
        </View>
        {/* 테마 리스트 */}
        <View style={{ position: 'absolute', zIndex: 3, justifyContent: 'flex-end', flexDirection: 'row', width: '100%' }}>
          <SelectDropdown
            buttonStyle={{
              backgroundColor: themeColor[0],
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}
            defaultButtonText="테마 변경하기"
            data={colorArr}
            rowStyle={(index) => {
              console.log(index);
            }}
            rowTextStyle={{ color: themeColor[1] }}
            dropdownStyle={{ backgroundColor: themeColor[7] }}
            onSelect={onSelect}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          ></SelectDropdown>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  HomeText: {
    fontSize: 20,
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
  selectBtn: {
    fontSize: 20,
    padding: 10,
    color: '#000',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
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
