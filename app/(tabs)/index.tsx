import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Employee } from '../../types/employee';
import { StorageService } from '../../utils/storage';
import { formatCurrency, calculateTotalSalary, searchEmployees, markAsPaid, markAsUnpaid, getCurrentMonth } from '../../utils/helpers';
import EmployeeCard from '../../components/EmployeeCard';
import PinVerification from '../../components/PinVerification';
import PinSetup from '../../components/PinSetup';
import SplashScreen from '../../components/SplashScreen';
import GlassButton from '../../components/GlassButton';

export default function EmployeeListScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      checkPinAndLoadData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchEmployees(employees, searchQuery);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const checkPinAndLoadData = async () => {
    const isPinEnabled = await StorageService.isPinEnabled();
    const employees = await StorageService.getEmployees();
    
    if (isPinEnabled) {
      setShowPinVerification(true);
    } else if (employees.length === 0) {
      // First time user - show PIN setup
      setShowPinSetup(true);
    } else {
      setIsAuthenticated(true);
      loadEmployees();
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await StorageService.getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSuccess = () => {
    setShowPinVerification(false);
    setIsAuthenticated(true);
    loadEmployees();
  };

  const handlePinCancel = () => {
    // In a real app, you might want to exit the app or show a different screen
    Alert.alert('Access Denied', 'PIN is required to access the app');
  };

  const handlePinSetupComplete = () => {
    setShowPinSetup(false);
    setIsAuthenticated(true);
    loadEmployees();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEmployees();
    setRefreshing(false);
  };

  const handleAddEmployee = () => {
    router.push('/add-employee');
  };

  const handleEditEmployee = (employee: Employee) => {
    router.push({
      pathname: '/edit-employee',
      params: { id: employee.id }
    });
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await StorageService.deleteEmployee(id);
      await loadEmployees();
      Alert.alert('Success', 'Employee deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete employee');
    }
  };

  const handleMarkPaid = async (employee: Employee) => {
    try {
      const currentMonth = getCurrentMonth();
      const updatedEmployee = markAsPaid(employee, currentMonth, employee.salary);
      await StorageService.updateEmployee(updatedEmployee);
      await loadEmployees();
      Alert.alert('Success', `${employee.name} marked as paid for ${currentMonth}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  const handleMarkUnpaid = async (employee: Employee) => {
    try {
      const currentMonth = getCurrentMonth();
      const updatedEmployee = markAsUnpaid(employee, currentMonth);
      await StorageService.updateEmployee(updatedEmployee);
      await loadEmployees();
      Alert.alert('Success', `${employee.name} marked as unpaid for ${currentMonth}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    }
  };

  const totalSalary = calculateTotalSalary(employees);
  const activeEmployees = employees.filter(emp => emp.isActive);
  const inactiveEmployees = employees.filter(emp => !emp.isActive);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showPinVerification) {
    return (
      <PinVerification
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    );
  }

  if (showPinSetup) {
    return (
      <PinSetup
        onComplete={handlePinSetupComplete}
      />
    );
  }

  if (!isAuthenticated) {
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
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Employee Salary Manager
          </Text>
        </View>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search employees..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Statistics */}
      <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between mb-4">
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Total Employees</Text>
            <Text className="text-2xl font-bold text-gray-900">{employees.length}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Active</Text>
            <Text className="text-2xl font-bold text-green-600">{activeEmployees.length}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-500">Inactive</Text>
            <Text className="text-2xl font-bold text-red-600">{inactiveEmployees.length}</Text>
          </View>
        </View>
        
        <View className="border-t border-gray-200 pt-4">
          <Text className="text-sm text-gray-500">Total Salary</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalSalary, 'ETB')}
          </Text>
        </View>
      </View>

      {/* Employee List */}
      <View className="flex-1 px-4 mt-4 pb-32">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">Loading employees...</Text>
          </View>
        ) : filteredEmployees.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">
              {searchQuery ? 'No employees found' : 'No employees yet'}
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search' : 'Add your first employee to get started'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EmployeeCard
                employee={item}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-32 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{ backgroundColor: '#3B82F6' }}
        onPress={handleAddEmployee}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
