import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number; // Duration in milliseconds (default: 8000ms)
}

export default function SplashScreen({ onFinish, duration = 8000 }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
        delay: 300,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        delay: 600,
      }),
    ]);

    animation.start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration - 1000,
      useNativeDriver: false,
      delay: 1000,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, logoScaleAnim, textSlideAnim, progressAnim, onFinish, duration]);

  return (
    <ImageBackground
      source={require('../assets/images/all.jpg')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      resizeMode="cover"
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.4)', 'rgba(29, 78, 216, 0.6)', 'rgba(30, 64, 175, 0.8)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Main Content */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* App Logo */}
        <Animated.View 
          className="mb-8"
          style={{
            transform: [{ scale: logoScaleAnim }],
          }}
        >
          <View className="w-32 h-32 bg-white/20 rounded-3xl justify-center items-center mb-6 backdrop-blur-sm border border-white/30">
            <View className="w-24 h-24 bg-white/30 rounded-2xl justify-center items-center">
              <Ionicons name="people" size={48} color="white" />
            </View>
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.View
          style={{
            transform: [{ translateY: textSlideAnim }],
            opacity: fadeAnim,
          }}
        >
          <Text className="text-white text-6xl font-bold mb-2 text-center drop-shadow-2xl">
            Employee
          </Text>
          <Text className="text-white text-6xl font-bold mb-2 text-center drop-shadow-2xl">
            Salary
          </Text>
          <Text className="text-white text-6xl font-bold mb-6 text-center drop-shadow-2xl">
            Management
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: textSlideAnim }],
          }}
        >
          <Text className="text-white/90 text-xl text-center px-8 drop-shadow-lg font-medium">
            Secure • Simple • Smart
          </Text>
        </Animated.View>

        {/* Progress Bar */}
        <View className="mt-16 w-64">
          <View className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <Animated.View 
              className="bg-white h-2 rounded-full"
              style={{
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          </View>
          <Text className="text-white/80 text-sm text-center mt-3 font-medium">
            Loading your workspace...
          </Text>
        </View>
      </Animated.View>

      {/* Bottom Section */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 100,
          opacity: fadeAnim,
          transform: [{ translateY: textSlideAnim }],
        }}
      >
        <View className="flex-row items-center space-x-4">
          <View className="w-2 h-2 bg-white/60 rounded-full" />
          <Text className="text-white/80 text-lg font-medium drop-shadow-md">
            Managing your team, simplified
          </Text>
          <View className="w-2 h-2 bg-white/60 rounded-full" />
        </View>
      </Animated.View>

      {/* Top Decorative Elements */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 80,
          right: 30,
          opacity: fadeAnim,
          transform: [{ scale: logoScaleAnim }],
        }}
      >
        <View className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20" />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 120,
          left: 30,
          opacity: fadeAnim,
          transform: [{ scale: logoScaleAnim }],
        }}
      >
        <View className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20" />
      </Animated.View>

      {/* Bottom Decorative Elements */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 200,
          left: 40,
          opacity: fadeAnim,
          transform: [{ scale: logoScaleAnim }],
        }}
      >
        <View className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20" />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 160,
          right: 50,
          opacity: fadeAnim,
          transform: [{ scale: logoScaleAnim }],
        }}
      >
        <View className="w-10 h-10 bg-white/10 rounded-full backdrop-blur-sm border border-white/20" />
      </Animated.View>
    </ImageBackground>
  );
} 