import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export function Arrive({ route }) {
  // navigation 으로 받은 keyword
  const [bstopid, setID] = useState(route.params.id);

  // 사용자에게 보여줄 데이터
  const [data, setData] = useState([]);

  let key = 0;

  const search = (values) => {
    console.log('search 가동');
    setData([]);
    let totalArr = [];
    let bsArr = [];

    let xhr = new XMLHttpRequest();
    let url = 'http://apis.data.go.kr/6260000/BusanBIMS/stopArrByBstopid';
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'hGeBuMFhtkE6bZ%2F2wNlO2vAP6MQevzRFM0I3Zz3ILWTCbLbTHuNHDKtwOwcOENS%2FvJknwdmrLYTYH8pNbyhWzA%3D%3D';
    queryParams += '&' + encodeURIComponent('bstopid') + '=' + encodeURIComponent(bstopid);

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);
        const str = JSON.stringify(this.responseText);
        const strArr = str.split('<');

        for (let i = 0; i < strArr.length; i++) {
          if (strArr[i].includes('/lineno')) {
            bsArr.push(strArr[i - 1].substring(7));
          } else if (strArr[i].includes('/min1')) {
            bsArr.push(strArr[i - 1].substring(5));
          } else if (strArr[i].includes('/item')) {
            totalArr.push(bsArr);
            bsArr = [];
          }
        }
        console.log(totalArr);
        setData(totalArr);
      }
    };

    xhr.send('');
  };

  useEffect(() => {
    search();
  }, [route]);

  const renderItem = ({ item }) => {
    let color = '#6495ED';

    // 5분 밑이면 빨간색, 기본은 파란색 적용
    if (item[1] < 6) {
      color = '#B22222';
    }

    return (
      <View style={styles.content}>
        <Text>{item[0]}</Text>
        {item[1] && <Text style={{ fontWeight: '500', color: color, fontSize: 20 }}> {item[1]}분 후 도착</Text>}
      </View>
    );
  };

  return (
    <View>
      <FlatList data={data} renderItem={renderItem}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderBottomWidth: 2,
    color: '#888',
    borderColor: '#888',
    marginBottom: 10,
    paddingLeft: 20,
    paddingTop: 10,
  },
});
