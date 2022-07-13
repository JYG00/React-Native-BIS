import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Loading from '../loading/loading';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../storage/storage';

export function Arrive({ route }) {
  // navigation 으로 받은 keyword
  const [bstopid, setID] = useState(route.params.id);
  const [bstopName, setBstopName] = useState(route.params.name);

  // navigation 으로 받은 테마 색상
  const [themeColor, setThemeColor] = useState(route.params.themeColor);

  // 사용자에게 보여줄 데이터
  const [data, setData] = useState([]);

  // 대기 시간이 길 경우 로딩 아이콘
  const [loading, setLoading] = useState(false);

  let key = 0;

  const search = (values) => {
    console.log('search');
    setLoading(true);
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
        totalArr.pop();
        setLoading(false);
        setData(totalArr);
      }
    };

    xhr.send('');
  };

  useEffect(() => {
    search();
  }, [route]);

  // add myList
  const onPress=()=>{
    let userBstopArr = [{BstopId:bstopid,BstopName:bstopName}];

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
      const result = ret.filter((result)=>result.BstopId === bstopid);
      // remove 
      if(result.length>0){
        alert('rejected');
        return;
      }
      ret.map((result)=>userBstopArr.push(result));
      storage.save({key:'userBstop',id:'2',data:userBstopArr});
      //storage.remove({key:'userBstop',id:'2'});
      alert(`${bstopName} add`);
    })
    .catch(err => {
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          storage.save({key:'userBstop',id:'2',data:userBstopArr}); alert(`${bstopName} add`);
          break;
        case 'ExpiredError':
          break;
      }
    });
  }

  const renderItem = ({ item }) => {
    let color = '#fff';

    // 5분 밑이면 빨간색, 기본은 하얀색 적용
    if (item[1] < 6) {
      color = themeColor[3];
    }

    return (
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 3, y: 0 }} colors={[themeColor[4], themeColor[5], themeColor[6]]} style={styles.content}>
        <Text style={{ fontSize: 20, color: '#555', fontWeight: '600' }}>{item[0]}</Text>
        {item[1] && <Text style={{ fontWeight: 'bold', color: color, fontSize: 20 }}> {item[1]}분 후 도착</Text>}
      </LinearGradient>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColor[0] }}>
      {loading && (
        <View style={{ flex: 1 }}>
          <Loading themeColor={themeColor} />
        </View>
      )}
      <View>
        <View style={styles.title}>
        <TouchableOpacity onPress={onPress} style={[styles.title_txt,{backgroundColor:themeColor[0]}]}>
          <Text >Hello</Text>
          </TouchableOpacity>
          </View>
        <FlatList data={data} renderItem={renderItem}></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  title: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title_txt: {
    zIndex: 2,
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
});
