import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../utils/storage';
import GlassButton from './GlassButton';
import { useTheme } from '../contexts/ThemeContext';

interface PinVerificationProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PinVerification({ onSuccess, onCancel }: PinVerificationProps) {
  const { colors, isDark } = useTheme();
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredPin();
  }, []);

  const loadStoredPin = async () => {
    const pin = await StorageService.getPin();
    setStoredPin(pin);
    setIsLoading(false);
  };

  const handlePinSubmit = () => {
    if (pin === storedPin) {
      onSuccess();
    } else {
      Alert.alert('Incorrect PIN', 'Please enter the correct PIN to access the app.');
      setPin('');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-full max-w-sm">
            <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
              Enter PIN
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Please enter your PIN to access the app
            </Text>
            
            <TextInput
              style={{
                color: '#111827',
                backgroundColor: '#FFFFFF',
                borderColor: '#3B82F6',
                borderWidth: 2,
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
              className="text-center text-2xl font-bold p-4 rounded-2xl mb-6"
              value={pin}
              onChangeText={setPin}
              placeholder="Enter PIN"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              autoFocus
            />
            
            <View className="flex-row space-x-3">
              <GlassButton
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                style={{ flex: 1 }}
              />
              
              <GlassButton
                title="Submit"
                onPress={handlePinSubmit}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 