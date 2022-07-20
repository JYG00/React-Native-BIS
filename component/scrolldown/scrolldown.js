import React, { useRef, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated, Button } from 'react-native';

export default function ScrollDown() {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const playAnim = () => {
    Animated.loop(Animated.timing(scrollAnim, { toValue: 600, duration: 2000, useNativeDriver: true }), { iterations: 2 }).start();
  };
  useEffect(() => {
    playAnim();
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 2,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateY: scrollAnim }],
        }}
      >
        <FontAwesome name="bus" size={30} color="black" />
        <Entypo name="arrow-down" size={24} color="black" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
