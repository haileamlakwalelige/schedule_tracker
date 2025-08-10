import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../utils/storage';
import { AppSettings } from '../../types/employee';
import GlassButton from '../../components/GlassButton';
import AppLogo from '../../components/AppLogo';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    currency: 'ETB'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleChangeCurrency = async (currency: 'ETB' | 'USD') => {
    try {
      const updatedSettings = { ...settings, currency };
      await StorageService.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      Alert.alert('Success', `Currency changed to ${currency}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update currency');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center mb-2">
            <AppLogo size="small" showText={false} />
            <Text className="text-2xl font-bold text-gray-900 ml-3">Employee Salary Management</Text>
          </View>
          <Text className="text-gray-600 text-sm">Settings & Configuration</Text>
        </View>



        {/* App Settings */}
        <View className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">App Settings</Text>
          </View>
          
          <View className="p-4">
            {/* Currency */}
            <View className="mb-6">
              <Text className="text-gray-900 font-medium mb-3">Currency</Text>
              <View className="flex-row space-x-4">
                {(['ETB', 'USD'] as const).map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    className={`flex-1 py-3 px-4 rounded-lg border mx-3 text-gray-900`}
                    style={{
                      backgroundColor: settings.currency === currency ? '#3B82F6' : '#F3F4F6',
                      borderColor: settings.currency === currency ? '#3B82F6' : '#E5E7EB',
                    }}
                    onPress={() => handleChangeCurrency(currency)}
                  >
                    <Text
                      className="text-center font-medium"
                      style={{
                        color: settings.currency === currency ? '#FFFFFF' : '#374151',
                      }}
                    >
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">Data Management</Text>
          </View>
          
          <View className="p-4">
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => {
                Alert.alert(
                  'Clear All Data',
                  'Are you sure you want to clear all employee data? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Clear All', 
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await StorageService.saveEmployees([]);
                          Alert.alert('Success', 'All data has been cleared');
                        } catch (error) {
                          Alert.alert('Error', 'Failed to clear data');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="text-red-600 font-medium ml-3">Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">App Information</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Version</Text>
              <Text className="text-gray-900">1.0.0</Text>
            </View>
            
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Build</Text>
              <Text className="text-gray-900">2024.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 