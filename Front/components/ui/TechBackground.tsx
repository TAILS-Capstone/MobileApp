import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface TechBackgroundProps {
  intensity?: number; // Controls the visibility/intensity of the elements (0-1)
  animated?: boolean; // Whether elements should animate
  variant?: 'default' | 'dark' | 'vibrant'; // Background variant
  backgroundImage?: any; // Optional background image source
  overlayOpacity?: number; // Opacity for the gradient overlay on top of the image (0-1)
}

const TechBackground: React.FC<TechBackgroundProps> = ({ 
  intensity = 0.5, 
  animated = true,
  variant = 'vibrant',
  backgroundImage = null,
  overlayOpacity = 0.7
}) => {
  // Animation values
  const fadeAnim1 = new Animated.Value(0);
  const fadeAnim2 = new Animated.Value(0);
  const moveAnim1 = new Animated.Value(0);
  const moveAnim2 = new Animated.Value(0);
  
  useEffect(() => {
    if (animated) {
      // Start animations in sequence
      Animated.sequence([
        Animated.timing(fadeAnim1, {
          toValue: intensity,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: intensity,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Create floating effect for grid elements
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim1, {
            toValue: 10,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim1, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim2, {
            toValue: -10,
            duration: 12000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim2, {
            toValue: 0,
            duration: 12000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // If not animated, just show at full intensity
      fadeAnim1.setValue(intensity);
      fadeAnim2.setValue(intensity);
    }
  }, [animated, intensity]);

  // Get gradient colors based on variant
  const getGradientColors = (): [string, string, string] => {
    switch (variant) {
      case 'dark':
        return backgroundImage 
          ? ['#000000', '#101025', '#131333'] 
          : ['#050518', '#0a0a24', '#0d0d33'];
      case 'vibrant':
        return backgroundImage 
          ? ['#131339', '#141464', '#141488'] 
          : ['#0e1339', '#1a1a5c', '#282880'];
      default:
        return backgroundImage 
          ? ['#0f1830', '#15244e', '#1c3166'] 
          : ['#0f0f2d', '#1a1a3b', '#121240'];
    }
  };

  // Get element color based on variant
  const getElementColor = () => {
    switch (variant) {
      case 'dark':
        return 'rgba(74, 136, 255, 0.3)';
      case 'vibrant':
        return 'rgba(97, 175, 255, 0.6)';
      default:
        return 'rgba(74, 136, 255, 0.2)';
    }
  };

  // Generate tech grid patterns
  const renderGridElements = () => {
    const elements = [];
    const gridSize = 20;
    const elementSize = 3; // Larger dots for more visibility
    const gridOpacity = 0.15 * intensity;
    const elementColor = getElementColor();

    for (let i = 0; i < width / gridSize; i++) {
      for (let j = 0; j < height / gridSize; j++) {
        // Create more dense grid pattern (lower threshold means more elements)
        if (Math.random() > 0.8) {
          elements.push(
            <View
              key={`grid-${i}-${j}`}
              style={[
                styles.gridElement,
                {
                  left: i * gridSize,
                  top: j * gridSize,
                  width: elementSize,
                  height: elementSize,
                  opacity: gridOpacity,
                  backgroundColor: elementColor,
                },
              ]}
            />
          );
        }
      }
    }
    return elements;
  };

  // Generate some larger tech elements (circles, hexagons)
  const renderTechElements = () => {
    const elements = [];
    const elementColor = getElementColor();
    
    for (let i = 0; i < 10; i++) { // Increase number of elements
      const size = Math.random() * 180 + 60; // Larger elements
      elements.push(
        <View
          key={`tech-${i}`}
          style={[
            styles.techElement,
            {
              left: Math.random() * width,
              top: Math.random() * height,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? size / 2 : size / 6,
              opacity: 0.07 * intensity, // More visible
              borderColor: elementColor,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
            },
          ]}
        />
      );
    }
    return elements;
  };

  // Determine the background component based on whether an image is provided
  const BackgroundComponent = backgroundImage ? (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          `rgba(14, 19, 57, ${overlayOpacity})`,
          `rgba(26, 26, 92, ${overlayOpacity})`,
          `rgba(40, 40, 128, ${overlayOpacity})`
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </ImageBackground>
  ) : (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Base background - either gradient or image with overlay */}
      {BackgroundComponent}
      
      {/* Grid elements */}
      <Animated.View 
        style={[
          styles.overlayContainer, 
          { 
            opacity: fadeAnim1,
            transform: [{ translateY: moveAnim1 }]
          }
        ]}
      >
        {renderGridElements()}
      </Animated.View>
      
      {/* Tech elements */}
      <Animated.View 
        style={[
          styles.overlayContainer, 
          { 
            opacity: fadeAnim2,
            transform: [{ translateY: moveAnim2 }]
          }
        ]}
      >
        {renderTechElements()}
      </Animated.View>
      
      {/* Circuit lines */}
      <Animated.View 
        style={[
          styles.circuitContainer, 
          { 
            opacity: fadeAnim1 
          }
        ]}
      >
        <View style={[styles.circuitLine, { top: height * 0.15, width: width * 0.8, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitLine, { top: height * 0.45, left: width * 0.2, width: width * 0.8, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitLine, { top: height * 0.75, width: width * 0.65, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitVertical, { left: width * 0.25, height: height * 0.5, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitVertical, { left: width * 0.75, top: height * 0.25, height: height * 0.6, backgroundColor: getElementColor() }]} />
        
        <View style={[styles.circuitNode, { top: height * 0.15, left: width * 0.8, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.45, left: width * 0.2, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.75, left: width * 0.65, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.15, left: width * 0.25, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.75, left: width * 0.75, backgroundColor: getElementColor() }]} />
        
        {/* Additional circuit elements for more complexity */}
        <View style={[styles.circuitDiagonal, { top: height * 0.3, left: width * 0.3, width: width * 0.4, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitDiagonal2, { top: height * 0.6, left: width * 0.4, width: width * 0.4, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.3, left: width * 0.7, backgroundColor: getElementColor() }]} />
        <View style={[styles.circuitNode, { top: height * 0.6, left: width * 0.4, backgroundColor: getElementColor() }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  gridElement: {
    position: 'absolute',
    backgroundColor: '#4a88ff',
    borderRadius: 2, // Make grid dots round
  },
  techElement: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#4a88ff',
    backgroundColor: 'transparent',
  },
  circuitContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  circuitLine: {
    position: 'absolute',
    height: 1, // Thinner lines
    backgroundColor: 'rgba(74, 136, 255, 0.15)',
  },
  circuitVertical: {
    position: 'absolute',
    width: 1, // Thinner lines
    backgroundColor: 'rgba(74, 136, 255, 0.15)',
  },
  circuitDiagonal: {
    position: 'absolute',
    height: 1, // Thinner lines
    backgroundColor: 'rgba(74, 136, 255, 0.15)',
    transform: [{ rotate: '45deg' }],
  },
  circuitDiagonal2: {
    position: 'absolute',
    height: 1, // Thinner lines
    backgroundColor: 'rgba(74, 136, 255, 0.15)',
    transform: [{ rotate: '-45deg' }],
  },
  circuitNode: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(74, 136, 255, 0.2)',
  },
});

export default TechBackground; 