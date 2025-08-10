import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function AppLogo({ size = 'medium', showText = true }: AppLogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, iconSize: 20, textSize: 12 };
      case 'large':
        return { width: 80, height: 80, iconSize: 40, textSize: 16 };
      default:
        return { width: 60, height: 60, iconSize: 30, textSize: 14 };
    }
  };

  const { width, height, iconSize, textSize } = getSize();

  return (
    <View style={{ alignItems: 'center' }}>
      <ImageBackground
        source={require('../assets/images/all.jpg')}
        style={{
          width,
          height,
          borderRadius: width / 2,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        resizeMode="cover"
      >
        {/* Overlay for better icon visibility */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="people" size={iconSize} color="white" />
        </View>
      </ImageBackground>
      
      {showText && (
        <Text
          style={{
            fontSize: textSize,
            fontWeight: 'bold',
            color: '#3B82F6',
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          ES Management
        </Text>
      )}
    </View>
  );
} 