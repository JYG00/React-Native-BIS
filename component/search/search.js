import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import Loading from '../loading/loading';
import { LinearGradient } from 'expo-linear-gradient';

// 정류소로 검색 페이지
export const BusStopSch = ({ route }) => {
  // navigation 으로 받은 테마 색상
  const [themeColor, setThemeColor] = useState(route.params.themeColor);

  const navigation = useNavigation();
  // 총 결과 건수가 담길 공간
  const [resultCount, setResultCount] = useState(0);
  // 정류소 정보가 담길 공간
  const [bstopid, setBstopid] = useState([]);
  const [buffering, setBuffering] = useState(false);

  const onSubmit = (values) => {
    console.log('val=', values.schValue);
    setBuffering(true);
    setBstopid([]);
    let bsArr = [];

    let xhr = new XMLHttpRequest();
    let url = 'http://apis.data.go.kr/6260000/BusanBIMS/busStopList';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'hGeBuMFhtkE6bZ%2F2wNlO2vAP6MQevzRFM0I3Zz3ILWTCbLbTHuNHDKtwOwcOENS%2FvJknwdmrLYTYH8pNbyhWzA%3D%3D';
    queryParams += '&' + encodeURIComponent('bstopnm') + '=' + encodeURIComponent(`${values.schValue}`);
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000');

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);
        const str = JSON.stringify(this.responseText);
        const strArr = str.split('<');

        setResultCount(str.substring(str.indexOf('<totalCount>') + 12, str.indexOf('</totalCount>')));
        for (let i = 0; i < strArr.length; i++) {
          if (strArr[i].substring(strArr[i].indexOf('bstopid>') + 8) > 1000000) {
            bsArr.push({ id: strArr[i].substring(8), name: strArr[i + 2].substring(8) });
          }
        }
        setBuffering(false);
        setBstopid(bsArr);
      }
    };

    xhr.send('');
  };

  // FlatList Item
  const item = ({ item }) => {
    const onPress = () => {
      navigation.navigate('도착시간', { id: item.id, themeColor: themeColor });
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient style={styles.result} start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]}>
          <Text style={{ fontSize: 15, color: '#888' }}>{item.id}</Text>
          <Text style={{ fontSize: 25 }}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
      {resultCount === 0 && (
        <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
          {({ handleChange, handleSubmit, values }) => (
            <View>
              <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="정류소를 검색합니다. 예) 부산시청" onSubmitEditing={handleSubmit} />
            </View>
          )}
        </Formik>
      )}
      {buffering && (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      )}
      <View>
        {resultCount !== 0 && (
          <View>
            <View style={styles.title}>
              <Text style={styles.title_txt}>검색결과 {resultCount}건 조회</Text>
            </View>
            <FlatList data={bstopid} renderItem={item} keyExtractor={(item) => item.id} disableFullscreenUI={false}></FlatList>
          </View>
        )}
      </View>
    </View>
  );
};

// 버스로 검색 페이지
export function BusSch({ route }) {
  // navigation 으로 받은 테마 색상
  const [themeColor, setThemeColor] = useState(route.params.themeColor);

  // 버퍼링 아이콘
  const [buffering, setBuffering] = useState(false);

  const navigation = useNavigation();
  // 총 결과 건수가 담길 공간
  const [resultCount, setResultCount] = useState(0);
  // 버스 노선이 담길 공간
  const [lineid, setLineid] = useState([]);
  // 버스 번호가 담길 공간
  const [bsNum, setBsNum] = useState();
  let index = 0;

  const set = (param) => {
    setLineid(param);
  };

  const onSubmit = (values) => {
    console.log('val=', values.schValue);
    set([]);
    setBsNum(values.schValue);
    setBuffering(true);
    let bsArr = [];

    // 검색할 버스 번호
    let num = null;

    if (values.schValue > 0 && values.schValue < 10) {
      num = `000${values.schValue}`;
    } else if (values.schValue > 9 && values.schValue < 100) {
      num = `00${values.schValue}`;
    } else if (values.schValue > 99 && values.schValue < 1000) {
      num = `0${values.schValue}`;
    } else {
      num = values.schValue;
    }

    let xhr = new XMLHttpRequest();
    let url = 'http://apis.data.go.kr/6260000/BusanBIMS/busInfoByRouteId';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'hGeBuMFhtkE6bZ%2F2wNlO2vAP6MQevzRFM0I3Zz3ILWTCbLbTHuNHDKtwOwcOENS%2FvJknwdmrLYTYH8pNbyhWzA%3D%3D';
    queryParams += '&' + encodeURIComponent('lineid') + '=' + encodeURIComponent(`520${num}000`);

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);
        const str = JSON.stringify(this.responseText);
        const strArr = str.split('<');

        setResultCount(str.substring(str.indexOf('<totalCount>') + 12, str.indexOf('</totalCount>')));
        for (let i = 0; i < strArr.length; i++) {
          if (strArr[i].substring(strArr[i].indexOf('nodeid>') + 7) > 1000000) {
            bsArr.push({ id: strArr[i].substring(7), name: strArr[i - 2].substring(8), index: index++ });
          }
        }
        setBuffering(false);
        set(bsArr);
      }
    };

    xhr.send('');
  };

  // FlatList Item
  const item = ({ item }) => {
    const onPress = () => {
      navigation.navigate('도착시간', { id: item.id, themeColor: themeColor });
    };

    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient style={styles.result} start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]}>
          <Text style={{ fontSize: 15, color: '#888' }}>{item.id}</Text>
          <Text style={{ fontSize: 25 }}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
      {resultCount === 0 && (
        <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
          {({ handleChange, handleSubmit, values }) => (
            <View>
              <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="버스를 검색합니다. 예) 1, 11, 111" onSubmitEditing={handleSubmit} />
            </View>
          )}
        </Formik>
      )}
      {buffering && (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      )}
      <View>
        {resultCount !== 0 && (
          <View>
            <View style={styles.title}>
              <Text style={styles.title_txt}>{bsNum}번 버스 검색결과</Text>
            </View>
            <FlatList data={lineid} renderItem={item} keyExtractor={(item) => item.index}></FlatList>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f0',
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    fontSize: 20,
    paddingLeft: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  title: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title_txt: {
    fontSize: 20,
    padding: 10,
    backgroundColor: '#fff0f0',
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
  result: {
    flex: 0,
    width: '100%',
    height: 80,
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
    marginBottom: 20,
    paddingLeft: 20,
    paddingTop: 10,
  },
});
