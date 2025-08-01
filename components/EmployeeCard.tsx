import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Employee } from '../types/employee';
import { formatCurrency, formatDate, getSalaryDateText, getCurrentMonth, getPaymentStatus } from '../utils/helpers';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onMarkPaid?: (employee: Employee) => void;
  onMarkUnpaid?: (employee: Employee) => void;
}

export default function EmployeeCard({ 
  employee, 
  onEdit, 
  onDelete, 
  onMarkPaid, 
  onMarkUnpaid 
}: EmployeeCardProps) {
  const currentMonth = getCurrentMonth();
  const paymentStatus = getPaymentStatus(employee, currentMonth);

  const handleDelete = () => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(employee.id) },
      ]
    );
  };

  const handleMarkPaid = () => {
    if (onMarkPaid) {
      onMarkPaid(employee);
    }
  };

  const handleMarkUnpaid = () => {
    if (onMarkUnpaid) {
      onMarkUnpaid(employee);
    }
  };

  return (
    <View 
      className="rounded-2xl shadow-sm border p-4 mb-4"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {employee.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            {employee.position} • {employee.department}
          </Text>
          {employee.email && (
            <Text className="text-sm text-gray-500 mb-1">
              {employee.email}
            </Text>
          )}
        </View>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#DBEAFE' }}
            onPress={() => onEdit(employee)}
          >
            <Ionicons name="pencil" size={16} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#FEE2E2' }}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-xs text-gray-500">Start Date</Text>
          <Text className="text-sm font-medium text-gray-900">
            {formatDate(employee.startDate)}
          </Text>
        </View>
        
        {employee.endDate && (
          <View>
            <Text className="text-xs text-gray-500">End Date</Text>
            <Text className="text-sm font-medium text-gray-900">
              {formatDate(employee.endDate)}
            </Text>
          </View>
        )}
        
        <View>
          <Text className="text-xs text-gray-500">Salary</Text>
          <Text className="text-sm font-bold text-green-600">
            {formatCurrency(employee.salary)}
          </Text>
        </View>
      </View>

      {/* Salary Date Info */}
      <View className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF' }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Salary Date</Text>
            <Text className="text-sm font-medium text-gray-900">
              {employee.salaryDate}th of each month
            </Text>
            <Text className="text-xs text-blue-600 font-medium">
              {getSalaryDateText(employee.salaryDate)}
            </Text>
          </View>
          <Ionicons name="calendar" size={20} color="#3B82F6" />
        </View>
      </View>
      
      {/* Payment Status */}
      <View className="mb-3">
        <Text className="text-xs text-gray-500 mb-2">Current Month Payment Status</Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            className={`flex-1 py-2 px-3 rounded-lg border ${
              paymentStatus === 'paid' 
                ? 'bg-green-100 border-green-500' 
                : 'bg-gray-100 border-gray-300'
            }`}
            onPress={handleMarkPaid}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name={paymentStatus === 'paid' ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                size={16} 
                color={paymentStatus === 'paid' ? '#059669' : '#6B7280'} 
              />
              <Text 
                className="ml-1 text-xs font-medium"
                style={{ color: paymentStatus === 'paid' ? '#059669' : '#6B7280' }}
              >
                Paid
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`flex-1 py-2 px-3 rounded-lg border ${
              paymentStatus === 'unpaid' 
                ? 'bg-red-100 border-red-500' 
                : 'bg-gray-100 border-gray-300'
            }`}
            onPress={handleMarkUnpaid}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name={paymentStatus === 'unpaid' ? 'close-circle' : 'close-circle-outline'} 
                size={16} 
                color={paymentStatus === 'unpaid' ? '#DC2626' : '#6B7280'} 
              />
              <Text 
                className="ml-1 text-xs font-medium"
                style={{ color: paymentStatus === 'unpaid' ? '#DC2626' : '#6B7280' }}
              >
                Unpaid
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="flex-row items-center">
        <View 
          className="px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: employee.isActive 
              ? '#D1FAE5' 
              : '#FEE2E2' 
          }}
        >
          <Text 
            className="text-xs font-medium"
            style={{ 
              color: employee.isActive 
                ? '#059669' 
                : '#DC2626' 
            }}
          >
            {employee.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        
        {employee.phone && (
          <Text className="text-xs text-gray-500 ml-2">
            📞 {employee.phone}
          </Text>
        )}
      </View>
    </View>
  );
} 