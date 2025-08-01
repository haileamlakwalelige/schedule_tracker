import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function GlassButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: GlassButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    };

    const sizeStyles = {
      small: { paddingVertical: 10, paddingHorizontal: 20 },
      medium: { paddingVertical: 14, paddingHorizontal: 28 },
      large: { paddingVertical: 18, paddingHorizontal: 36 },
    };

    return { ...baseStyle, ...sizeStyles[size], ...style };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.5,
    };

    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#374151' },
      danger: { color: '#FFFFFF' },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const getGradientColors = () => {
    if (disabled) {
      return ['#9CA3AF', '#6B7280'];
    }

    switch (variant) {
      case 'primary':
        return ['#3B82F6', '#1D4ED8', '#1E40AF'];
      case 'secondary':
        return ['#F3F4F6', '#E5E7EB', '#D1D5DB'];
      case 'danger':
        return ['#EF4444', '#DC2626', '#B91C1C'];
      default:
        return ['#3B82F6', '#1D4ED8', '#1E40AF'];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 16,
          paddingVertical: 2,
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
            backgroundColor: variant === 'secondary' ? '#FFFFFF' : 'transparent',
            width: '100%',
          }}
        >
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
} 