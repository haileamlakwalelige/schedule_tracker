import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../utils/storage';
import GlassButton from './GlassButton';
import { useTheme } from '../contexts/ThemeContext';

interface PinSetupProps {
  onComplete: () => void;
}

export default function PinSetup({ onComplete }: PinSetupProps) {
  const { colors, isDark } = useTheme();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');

  const handleSetupPin = () => {
    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmPin = async () => {
    if (confirmPin.length !== 4) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }

    try {
      await StorageService.setPin(pin);
      Alert.alert('Success', 'PIN has been set successfully', [
        { text: 'OK', onPress: onComplete }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to set PIN');
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip PIN Setup',
      'You can set up PIN protection later in the settings. Are you sure you want to skip?',
      [
        { text: 'Set PIN Later', onPress: onComplete },
        { text: 'Continue Setup', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-full max-w-sm">
            <Text className="text-gray-900 text-3xl font-bold text-center mb-2">
              Welcome!
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Set up a PIN to protect your employee data
            </Text>
            
            {step === 'setup' ? (
              <>
                <Text className="text-gray-900 text-lg font-semibold mb-4 text-center">
                  Create Your PIN
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
                  placeholder="Enter 4-digit PIN"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  autoFocus
                />
                
                <View className="flex-row space-x-3 mb-4">
                  <GlassButton
                    title="Skip"
                    onPress={handleSkip}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                  
                  <GlassButton
                    title="Continue"
                    onPress={handleSetupPin}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            ) : (
              <>
                <Text className="text-gray-900 text-lg font-semibold mb-4 text-center">
                  Confirm Your PIN
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
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  placeholder="Confirm 4-digit PIN"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  autoFocus
                />
                
                <View className="flex-row space-x-3">
                  <GlassButton
                    title="Back"
                    onPress={() => setStep('setup')}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                  
                  <GlassButton
                    title="Confirm"
                    onPress={handleConfirmPin}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 