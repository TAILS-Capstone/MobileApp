import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface CirclePatternProps {
  size?: number;
  color?: string;
  position?: { top?: number; bottom?: number; left?: number; right?: number };
  animated?: boolean;
  opacity?: number;
}

const CirclePattern: React.FC<CirclePatternProps> = ({
  size = 300,
  color = '#3a82ff',
  position = { top: -150, right: -150 },
  animated = true,
  opacity = 0.1,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: opacity,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 65000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 12000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 12000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // If not animated, just set final values
      fadeAnim.setValue(opacity);
    }
  }, [animated, opacity]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          ...position,
          opacity: fadeAnim,
          transform: [
            { rotate: spin },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* Outer circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderColor: color,
          },
        ]}
      />

      {/* Middle circle */}
      <View
        style={[
          styles.circle,
          {
            width: size * 0.75,
            height: size * 0.75,
            borderColor: color,
          },
        ]}
      />

      {/* Inner circle */}
      <View
        style={[
          styles.circle,
          {
            width: size * 0.5,
            height: size * 0.5,
            borderColor: color,
          },
        ]}
      />

      {/* Cross lines */}
      <View style={[styles.line, { width: size * 0.9, borderColor: color }]} />
      <View style={[styles.line, { width: size * 0.9, borderColor: color, transform: [{ rotate: '90deg' }] }]} />
      <View style={[styles.line, { width: size * 0.9, borderColor: color, transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.line, { width: size * 0.9, borderColor: color, transform: [{ rotate: '135deg' }] }]} />

      {/* Markings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <View
          key={`mark-${i}`}
          style={[
            styles.mark,
            {
              backgroundColor: color,
              transform: [
                { rotate: `${i * 30}deg` },
                { translateX: size / 2 - 8 },
              ],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  line: {
    position: 'absolute',
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  mark: {
    position: 'absolute',
    width: 6,
    height: 2,
    borderRadius: 1,
    left: '50%',
    top: '50%',
  },
});

export default CirclePattern; 