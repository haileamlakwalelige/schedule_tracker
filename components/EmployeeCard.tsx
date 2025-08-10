import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Employee } from '../types/employee';
import { formatCurrency, formatDate, getSalaryDateText, getCurrentMonth, getPaymentStatus, getSalaryCycleInfo } from '../utils/helpers';

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
      className="rounded-3xl mb-4 overflow-hidden"
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
        style={{
          padding: 20,
          borderRadius: 24,
        }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
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
          
          <View className="flex-row space-x-3 gap-2">
            <TouchableOpacity
              className="p-2 rounded-xl"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              onPress={() => onEdit(employee)}
            >
              <Ionicons name="pencil" size={20} color="#3B82F6" />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="p-2 rounded-xl"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Employee Details */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-xs text-gray-500 font-medium">Start Date</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatDate(employee.startDate)}
            </Text>
          </View>
          
          {employee.endDate && (
            <View>
              <Text className="text-xs text-gray-500 font-medium">End Date</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {formatDate(employee.endDate)}
              </Text>
            </View>
          )}
          
          <View>
            <Text className="text-xs text-gray-500 font-medium">Salary</Text>
            <Text className="text-sm font-bold text-green-600">
              {formatCurrency(employee.salary)}
            </Text>
          </View>
        </View>

        {/* Salary Cycle Info */}
        <View className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-medium">Salary Cycle</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {formatDate(employee.startDate)} - {formatDate(employee.endDate || '')}
              </Text>
              <Text className="text-xs text-blue-600 font-medium mt-1">
                {getSalaryDateText(employee.startDate, employee.endDate || '')}
              </Text>
            </View>
            <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center">
              <Ionicons name="calendar" size={20} color="#3B82F6" />
            </View>
          </View>
          
          {/* Cycle Progress Bar */}
          {employee.endDate && (
            <View className="mt-3">
              {(() => {
                const cycleInfo = getSalaryCycleInfo(employee.startDate, employee.endDate);
                return (
                  <View>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-xs text-gray-500 font-medium">Cycle Progress</Text>
                      <Text className="text-xs text-gray-600 font-semibold">{cycleInfo.progress}%</Text>
                    </View>
                    <View className="w-full bg-gray-200 rounded-full h-2">
                      <View 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${cycleInfo.progress}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-2">
                      {cycleInfo.daysRemaining} days remaining in current cycle
                    </Text>
                  </View>
                );
              })()}
            </View>
          )}
        </View>
        
        {/* Payment Status */}
        <View className="mb-6">
          <Text className="text-xs text-gray-500 font-medium mb-4">Current Month Payment Status</Text>
          <View className="flex-row space-x-4 gap-3">
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-xl border ${
                paymentStatus === 'paid' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={handleMarkPaid}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={paymentStatus === 'paid' ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                  size={20} 
                  color={paymentStatus === 'paid' ? '#059669' : '#6B7280'} 
                />
                <Text 
                  className="ml-3 text-base font-medium"
                  style={{ color: paymentStatus === 'paid' ? '#059669' : '#6B7280' }}
                >
                  Paid
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-1 py-4 px-6 rounded-xl border ${
                paymentStatus === 'unpaid' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={handleMarkUnpaid}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={paymentStatus === 'unpaid' ? 'close-circle' : 'close-circle-outline'} 
                  size={20} 
                  color={paymentStatus === 'unpaid' ? '#DC2626' : '#6B7280'} 
                />
                <Text 
                  className="ml-3 text-base font-medium"
                  style={{ color: paymentStatus === 'unpaid' ? '#DC2626' : '#6B7280' }}
                >
                  Unpaid
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Status Badge */}
        <View className="flex-row justify-between items-center">
          <View 
            className="px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: employee.isActive 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)' 
            }}
          >
            <Text 
              className="text-xs font-semibold"
              style={{ 
                color: employee.isActive ? '#059669' : '#DC2626' 
              }}
            >
              {employee.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons 
              name={employee.isActive ? 'checkmark-circle' : 'close-circle'} 
              size={16} 
              color={employee.isActive ? '#059669' : '#DC2626'} 
            />
            <Text 
              className="ml-1 text-xs font-medium"
              style={{ 
                color: employee.isActive ? '#059669' : '#DC2626' 
              }}
            >
              {employee.isActive ? 'Working' : 'Not Working'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
} 