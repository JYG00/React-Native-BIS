import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';

// 정류소로 검색 페이지
export const BusStopSch = () => {
  const navigation = useNavigation();
  // 총 결과 건수가 담길 공간
  const [resultCount, setResultCount] = useState(0);
  // 정류소 정보가 담길 공간
  const [bstopid, setBstopid] = useState([]);

  const onSubmit = (values) => {
    console.log('val=', values.schValue);
    setBstopid([]);
    let bsArr = [];

    let xhr = new XMLHttpRequest();
    let url = 'http://apis.data.go.kr/6260000/BusanBIMS/busStopList';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'hGeBuMFhtkE6bZ%2F2wNlO2vAP6MQevzRFM0I3Zz3ILWTCbLbTHuNHDKtwOwcOENS%2FvJknwdmrLYTYH8pNbyhWzA%3D%3D';
    queryParams += '&' + encodeURIComponent('bstopnm') + '=' + encodeURIComponent(`${values.schValue}`);
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');

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

        setBstopid(bsArr);
      }
    };

    xhr.send('');
  };

  // FlatList Item
  const item = ({ item }) => {
    const onPress = () => {
      navigation.navigate('도착시간', { id: item.id });
    };

    return (
      <TouchableOpacity style={styles.result} onPress={onPress}>
        <Text>{item.id}</Text>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="정류소를 검색합니다" onSubmitEditing={handleSubmit} />
          </View>
        )}
      </Formik>
      <View>
        {resultCount !== 0 && (
          <View>
            <Text style={{ fontSize: 20, padding: 20, color: '#32CD32', fontWeight: '500' }}>검색결과 {resultCount}건 조회</Text>
            <FlatList data={bstopid} renderItem={item} keyExtractor={(item) => item.id}></FlatList>
          </View>
        )}
      </View>
    </View>
  );
};

// 버스로 검색 페이지
export function BusSch() {
  const navigation = useNavigation();
  // 총 결과 건수가 담길 공간
  const [resultCount, setResultCount] = useState(0);
  // 버스 노선이 담길 공간
  const [lineid, setLineid] = useState([]);
  // 버스 번호가 담길 공간
  const [bsNum, setBsNum] = useState();
  let i = 0;

  const onSubmit = (values) => {
    console.log('val=', values.schValue);
    setLineid([]);
    setBsNum(values.schValue);
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
            bsArr.push({ id: strArr[i].substring(7), name: strArr[i - 2].substring(8) });
          }
        }

        setLineid(bsArr);
      }
    };

    xhr.send('');
  };

  // FlatList Item
  const item = ({ item }) => {
    const onPress = () => {
      navigation.navigate('도착시간', { id: item.id });
    };

    return (
      <TouchableOpacity style={styles.result} onPress={onPress}>
        <Text>{item.id}</Text>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="버스를 검색합니다 예) 1, 11, 111" onSubmitEditing={handleSubmit} />
          </View>
        )}
      </Formik>
      <View>
        {resultCount !== 0 && (
          <View>
            <Text style={{ fontSize: 20, padding: 20, color: '#32CD32', fontWeight: '500' }}>{bsNum}번 버스 검색결과</Text>
            <FlatList data={lineid} renderItem={item} keyExtractor={(item) => item.id}></FlatList>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingLeft: 20,
    height: 70,
    backgroundColor: '#fff',
  },
  result: {
    width: '100%',
    height: 60,
    backgroundColor: '#fafafa',
    borderBottomWidth: 2,
    color: '#888',
    borderColor: '#888',
    marginBottom: 10,
    paddingLeft: 20,
    paddingTop: 10,
  },
});
