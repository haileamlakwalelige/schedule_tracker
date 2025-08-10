import React from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { StorageService } from '../utils/storage';
import EmployeeForm from '../components/EmployeeForm';
import { Employee } from '../types/employee';

export default function AddEmployeeScreen() {
  const router = useRouter();

  const handleSave = async (employee: Employee) => {
    try {
      await StorageService.addEmployee(employee);
      // Show success message briefly then navigate back
      Alert.alert('Success', 'Employee added successfully', [
        { text: 'OK', onPress: () => {
          router.back();
          // The main page will automatically refresh when it comes into focus
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add employee');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <EmployeeForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
} 