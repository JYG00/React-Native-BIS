import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Button } from 'react-native';

// 로딩 페이지
export default function Loading({ themeColor }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.2)).current;

  const playAnim = () => {
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 1000, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(opacityAnim, { toValue: 1, duration: 2000, useNativeDriver: true })).start();
  };

  useEffect(() => {
    playAnim();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColor[0] }]}>
      <View
        style={{
          backgroundColor: 'transparent',
          borderRadius: 200,
          overflow: 'hidden',
          width: 200,
          height: 200,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          backgroundColor: 'transparent',
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 2,
        }}
      >
        <Animated.View
          style={{
            borderTopWidth: 2,
            borderColor: '#00bfff',
            backgroundColor: themeColor[0],
            borderRadius: 200,
            height: 200,
            width: 200,
            transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
          }}
        ></Animated.View>
      </View>
      <Animated.Text style={{ marginTop: 15, opacity: opacityAnim }}>Loading...</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
