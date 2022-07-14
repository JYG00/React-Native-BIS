import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setColors, getColors } from '../colors/color';
import { LinearGradient } from 'expo-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import storage from '../storage/storage';

// 홈 화면
export function Home() {
  // 테마 색상 배열 (기본 테마 : Pink)
  const colorArr = ['Pink', 'Gray', 'Blue', 'Green'];
  // 테마가 색상이 들어갈 공간
  const [themeColor, setThemeColor] = useState();
  // route간 이동하기 위함
  const navigation = useNavigation();
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
            // 유저가 테마를 선택하지 않은 경우 기본 테마 (Pink) 적용
            setColors('Pink');

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

  // 즐겨찾기 목록 클릭 시
  const onPress = () => {
    navigation.navigate('즐겨찾기', { themeColor: themeColor });
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
          {/* 테마 리스트 */}
          <SelectDropdown
            buttonStyle={{ backgroundColor: 'transparent', width: '100%' }}
            buttonTextStyle={styles.HomeText}
            defaultButtonText="테마 변경하기"
            data={colorArr}
            rowTextStyle={{ color: '#fff', fontWeight: 'bold' }}
            dropdownStyle={{ backgroundColor: themeColor[7] }}
            onSelect={(selectedItem, index) => {
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
        <TouchableOpacity onPress={onPress}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={[styles.content_bottom, { borderColor: themeColor[2] }]}>
            <View>
              <Text style={[styles.HomeText, { paddingVertical: 10 }]}>즐겨찾기 목록</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
