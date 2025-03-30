import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  ImageBackground,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CirclePattern from './CirclePattern';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  backgroundImage: any;
  overlayColors?: [string, string, string];
  intensity?: number;
  enableRotation?: boolean;
  enableVerticalMovement?: boolean;
  enableFadeAnimation?: boolean;
  showCirclePatterns?: boolean;
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  backgroundImage,
  overlayColors = ['rgba(13, 13, 33, 0.4)', 'rgba(15, 15, 45, 0.3)', 'rgba(17, 17, 55, 0.3)'],
  intensity = 1.0,
  enableRotation = true,
  enableVerticalMovement = true,
  enableFadeAnimation = true,
  showCirclePatterns = true,
  children
}) => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0.9)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade animation loop
    if (enableFadeAnimation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1.0,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.9,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Set to full opacity if fade animation is disabled
      Animated.timing(fadeAnim, {
        toValue: 1.0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }

    // Vertical movement animation
    if (enableVerticalMovement) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 4,
            duration: 14000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 14000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: -4,
            duration: 14000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 14000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    // Rotation animation
    if (enableRotation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 30000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 30000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [enableVerticalMovement, enableRotation, enableFadeAnimation]);
  
  // Calculate rotation value
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg']
  });

  // Prepare transform array based on enabled animations
  const transformArray = [];
  if (enableVerticalMovement) transformArray.push({ translateY: moveAnim });
  if (enableRotation) transformArray.push({ rotate: spin });

  return (
    <View style={styles.container}>
      {/* Animated background */}
      <Animated.View 
        style={[
          styles.backgroundContainer,
          {
            opacity: fadeAnim,
            transform: transformArray
          }
        ]}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={overlayColors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </ImageBackground>
      </Animated.View>
      
      {/* Optional circle patterns */}
      {showCirclePatterns && (
        <>
          <CirclePattern size={400} position={{ top: -180, right: -180 }} opacity={0.08} />
          <CirclePattern size={320} position={{ bottom: -150, left: -130 }} color="#1E90FF" opacity={0.08} />
        </>
      )}
      
      {/* Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3b',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});

export default AnimatedBackground; 