import React, { useEffect } from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [schState, setSchState] = useState("0");

  return (
    <View style={styles.container}>
      {/* 상태표시줄 공백 */}
      <View style={{ height: 50 }}></View>
      <Main props={schState} />
      <View style={styles.nav}>
        <NavButton props={"정류소"} />
        <NavButton props={"버스"} />
        <NavButton props={"즐겨찾기"} />
      </View>
    </View>
  );
}
// 메인 페이지
export function Main({ props }) {
  return (
    <View style={styles.main}>
      {props !== "0" && (
        <View style={{ width: 200, borderWidth: 1 }}>
          <TextInput
            style={{ height: 70, backgroundColor: "#f3f3f3" }}
            placeholder={props}
          ></TextInput>
        </View>
      )}
    </View>
  );
}
// 네비 버튼
export function NavButton({ props }) {
  const onPress = () => {
    console.log(props);
  };

  return (
    <View>
      <TouchableOpacity style={styles.navBox} onPress={onPress}>
        <Text style={styles.navText}>{props}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    height: 650,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
  nav: {
    height: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "pink",
  },
  navBox: {
    width: 130,
    height: 90,
    borderRadius: 25,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
});
