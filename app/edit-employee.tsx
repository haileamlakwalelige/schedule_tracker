import React, { useState, useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StorageService } from '../utils/storage';
import EmployeeForm from '../components/EmployeeForm';
import { Employee } from '../types/employee';

export default function EditEmployeeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    if (!id) {
      Alert.alert('Error', 'Employee ID not found');
      router.back();
      return;
    }

    try {
      const employees = await StorageService.getEmployees();
      const foundEmployee = employees.find(emp => emp.id === id);
      
      if (!foundEmployee) {
        Alert.alert('Error', 'Employee not found');
        router.back();
        return;
      }

      setEmployee(foundEmployee);
    } catch (error) {
      Alert.alert('Error', 'Failed to load employee');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedEmployee: Employee) => {
    try {
      await StorageService.updateEmployee(updatedEmployee);
      Alert.alert('Success', 'Employee updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update employee');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Loading employee...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!employee) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Employee not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <EmployeeForm
        employee={employee}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
} 