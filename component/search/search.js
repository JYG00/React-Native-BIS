import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ScrollView } from 'react-native';
import { Formik } from 'formik';

// 정류소로 검색 페이지
export const BusStopSch = () => {
  const inputRef = useRef();
  const [resultCount, setResultCount] = useState(0);
  const [bstopid, setBstopid] = useState([]);
  let i = 0;

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
            bsArr.push([strArr[i].substring(8), strArr[i + 2].substring(8)]);
          }
        }

        setBstopid(bsArr);

        // // bstopid 중복 제거
        // const setId = new Set(bstopid);

        // console.log(setId);
      }
    };

    xhr.send('');
  };

  return (
    <View>
      <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="정류소를 검색합니다" ref={inputRef} onSubmitEditing={handleSubmit} />
          </View>
        )}
      </Formik>
      <View>
        {resultCount !== 0 && (
          <View>
            <Text style={{ fontSize: 20, padding: 20, color: '#32CD32', fontWeight: '500' }}>검색결과 {resultCount}건 조회</Text>
            {bstopid.map((val) => (
              <ScrollView key={i++} style={styles.result}>
                <Text>{val[0]}</Text>
                <Text>{val[1]}</Text>
              </ScrollView>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// 버스로 검색 페이지
export function BusSch() {
  const inputRef = useRef();
  const [resultCount, setResultCount] = useState(0);
  const [bstopid, setBstopid] = useState([]);
  let i = 0;

  const onSubmit = (values) => {
    console.log('val=', values.schValue);
    setBstopid([]);
    let bsArr = [];

    let xhr = new XMLHttpRequest();
    let url = 'http://apis.data.go.kr/6260000/BusanBIMS/busInfoByRouteId';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'hGeBuMFhtkE6bZ%2F2wNlO2vAP6MQevzRFM0I3Zz3ILWTCbLbTHuNHDKtwOwcOENS%2FvJknwdmrLYTYH8pNbyhWzA%3D%3D';
    queryParams += '&' + encodeURIComponent('lineid') + '=' + encodeURIComponent(`5200${values.schValue}000`);

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);
        const str = JSON.stringify(this.responseText);
        const strArr = str.split('<');

        setResultCount(str.substring(str.indexOf('<totalCount>') + 12, str.indexOf('</totalCount>')));
        for (let i = 0; i < strArr.length; i++) {
          if (strArr[i].substring(strArr[i].indexOf('nodeid>') + 7) > 1000000) {
            bsArr.push([strArr[i - 2].substring(8), strArr[i].substring(7), strArr[i + 2].substring(7)]);
          }
        }

        setBstopid(bsArr);
      }
    };

    xhr.send('');
  };

  return (
    <ScrollView>
      <Formik initialValues={{ schValue: '' }} onSubmit={onSubmit}>
        {({ handleChange, handleSubmit, values }) => (
          <View>
            <TextInput style={styles.input} value={values.schValue} onChangeText={handleChange('schValue')} placeholder="버스를 검색합니다 예) 1, 11, 111" ref={inputRef} onSubmitEditing={handleSubmit} />
          </View>
        )}
      </Formik>
      <View>
        {resultCount !== 0 && (
          <View>
            <Text style={{ fontSize: 20, padding: 20, color: '#32CD32', fontWeight: '500' }}>검색결과</Text>
            {bstopid.map((val) => (
              <ScrollView key={i++} style={styles.result}>
                <Text>{val[0]}</Text>
                <Text>{val[1]}</Text>
              </ScrollView>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
