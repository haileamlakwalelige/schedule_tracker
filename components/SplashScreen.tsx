import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
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
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

  return (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
          alignItems: 'center',
        }}
      >
        {/* App Icon */}
        <View className="mb-6">
          <View className="w-24 h-24 bg-white/20 rounded-3xl justify-center items-center mb-4">
            <Ionicons name="people" size={48} color="white" />
          </View>
        </View>

        {/* App Title */}
        <Text className="text-white text-4xl font-bold mb-2 text-center">
          Employee
        </Text>
        <Text className="text-white text-4xl font-bold mb-4 text-center">
          Salary Manager
        </Text>

        {/* Subtitle */}
        <Text className="text-white/80 text-lg text-center px-8">
          Secure • Simple • Smart
        </Text>

        {/* Loading Indicator */}
        <View className="mt-12 flex-row space-x-2">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                opacity: fadeAnim,
              }}
            />
          ))}
        </View>
      </Animated.View>

      {/* Bottom Text */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 60,
          opacity: fadeAnim,
        }}
      >
        <Text className="text-white/60 text-sm">
          Managing your team, simplified
        </Text>
      </Animated.View>
    </LinearGradient>
  );
} 