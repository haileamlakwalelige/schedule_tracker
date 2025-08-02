import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../utils/storage';
import GlassButton from './GlassButton';

interface PinVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinVerification({ onSuccess, onCancel }: PinVerificationProps) {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredPin();
  }, []);

  const loadStoredPin = async () => {
    try {
      const pin = await StorageService.getPin();
      setStoredPin(pin);
    } catch (error) {
      console.error('Error loading PIN:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin === storedPin) {
      onSuccess();
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN');
      setPin('');
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Loading...</Text>
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

            <View className="flex-row space-x-4">
              <View className="flex-1 mx-3">
                <TouchableOpacity onPress={handleCancel}>
                  <Text className="text-gray-900 text-center text-lg bg-gray-200 p-4 rounded-2xl">Cancel</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 mx-3">
                <TouchableOpacity onPress={handlePinSubmit}>
                  <Text className="text-white text-center text-lg bg-blue-500 p-4 rounded-2xl">Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 