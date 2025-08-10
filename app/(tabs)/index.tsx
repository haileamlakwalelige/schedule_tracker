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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Employee } from '../../types/employee';
import { StorageService } from '../../utils/storage';
import { formatCurrency, calculateTotalSalary, searchEmployees, markAsPaid, markAsUnpaid, getCurrentMonth } from '../../utils/helpers';
import EmployeeCard from '../../components/EmployeeCard';
import SplashScreen from '../../components/SplashScreen';
import GlassButton from '../../components/GlassButton';
import AppLogo from '../../components/AppLogo';

export default function EmployeeListScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      loadEmployees();
    }, 2000); // Increased from 1000ms to 2000ms for longer splash screen

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

  // Auto-refresh when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Only refresh if not in splash screen and not loading
      if (!showSplash && !isLoading) {
        loadEmployees();
      }
    }, [showSplash, isLoading])
  );

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

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <AppLogo size="small" showText={false} />
              <View className="ml-4">
                <Text className="text-white text-2xl font-bold">
                  Employee Salary
                </Text>
                <Text className="text-white/80 text-lg">
                  Management
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-12 h-12 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm"
              onPress={handleRefresh}
            >
              <Ionicons name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View className="flex-row items-center bg-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/30">
            <Ionicons name="search" size={20} color="white" />
            <TextInput
              className="flex-1 ml-3 text-white placeholder-white/70"
              placeholder="Search employees..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Statistics Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row space-x-4 gap-3">
            <View className="flex-1 bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="people" size={20} color="white" />
                <Text className="text-white/60 text-xs">Total</Text>
              </View>
              <Text className="text-white text-2xl font-bold">{employees.length}</Text>
              <Text className="text-white/60 text-xs">Employees</Text>
            </View>
            
            <View className="flex-1 bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                <Text className="text-white/60 text-xs">Active</Text>
              </View>
              <Text className="text-white text-2xl font-bold">{activeEmployees.length}</Text>
              <Text className="text-white/60 text-xs">Working</Text>
            </View>
            
            <View className="flex-1 bg-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/30">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="close-circle" size={20} color="#f87171" />
                <Text className="text-white/60 text-xs">Inactive</Text>
              </View>
              <Text className="text-white text-2xl font-bold">{inactiveEmployees.length}</Text>
              <Text className="text-white/60 text-xs">Employees</Text>
            </View>
          </View>
          
          {/* Total Salary Line */}
          <View className="mt-4 flex-row items-center justify-between bg-white/20 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/30">
            <View className="flex-row items-center">
              <Ionicons name="cash" size={20} color="#fbbf24" />
              <Text className="text-white/80 text-base font-medium ml-2">Total Salary <Text className="text-white/60 text-xs">/ Month</Text></Text>
            </View>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(totalSalary, 'ETB')}
            </Text>
          </View>
        </View>

        {/* Employee List */}
        <View className="flex-1 px-6 pb-32">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm mb-4">
                <Ionicons name="people" size={32} color="white" />
              </View>
              <Text className="text-white/80 text-lg">Loading employees...</Text>
            </View>
          ) : filteredEmployees.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <View className="w-24 h-24 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm mb-6">
                <Ionicons name="people-outline" size={48} color="white" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                {searchQuery ? 'No employees found' : 'No employees yet'}
              </Text>
              <Text className="text-white/70 text-center px-8">
                {searchQuery ? 'Try adjusting your search' : 'Add your first employee to get started'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  className="mt-6 bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30"
                  onPress={handleAddEmployee}
                >
                  <Text className="text-white font-semibold">Add First Employee</Text>
                </TouchableOpacity>
              )}
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
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={handleRefresh}
                  tintColor="white"
                  colors={["white"]}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          className="absolute bottom-32 right-6 w-16 h-16 rounded-full justify-center items-center shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 16,
          }}
          onPress={handleAddEmployee}
        >
          <Ionicons name="add" size={28} color="#667eea" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
