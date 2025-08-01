import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Employee } from '../types/employee';
import { generateId } from '../utils/helpers';
import GlassButton from './GlassButton';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    salaryDate: '',
    startDate: '',
    endDate: '',
    email: '',
    phone: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
        salaryDate: employee.salaryDate.toString(),
        startDate: employee.startDate,
        endDate: employee.endDate || '',
        email: employee.email || '',
        phone: employee.phone || '',
        isActive: employee.isActive,
      });
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    if (!formData.salaryDate.trim()) {
      newErrors.salaryDate = 'Salary date is required';
    } else {
      const salaryDay = Number(formData.salaryDate);
      if (isNaN(salaryDay) || salaryDay < 1 || salaryDay > 31) {
        newErrors.salaryDate = 'Salary date must be between 1 and 31';
      }
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const employeeData: Employee = {
      id: employee?.id || generateId(),
      name: formData.name.trim(),
      position: formData.position.trim(),
      department: formData.department.trim(),
      salary: Number(formData.salary),
      salaryDate: Number(formData.salaryDate),
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      isActive: formData.isActive,
      paymentHistory: employee?.paymentHistory || [],
      createdAt: employee?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(employeeData);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View className="p-4">
          <View 
            className="rounded-2xl p-6 mb-4"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <Text className="text-2xl font-bold text-gray-900 mb-6">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </Text>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Name *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.name ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter employee name"
                placeholderTextColor="#9CA3AF"
              />
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Position */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Position *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.position ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.position}
                onChangeText={(value) => updateFormData('position', value)}
                placeholder="Enter position"
                placeholderTextColor="#9CA3AF"
              />
              {errors.position && (
                <Text className="text-red-500 text-xs mt-1">{errors.position}</Text>
              )}
            </View>

            {/* Department */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Department *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.department ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.department}
                onChangeText={(value) => updateFormData('department', value)}
                placeholder="Enter department"
                placeholderTextColor="#9CA3AF"
              />
              {errors.department && (
                <Text className="text-red-500 text-xs mt-1">{errors.department}</Text>
              )}
            </View>

            {/* Salary */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Salary *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.salary ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.salary}
                onChangeText={(value) => updateFormData('salary', value)}
                placeholder="Enter salary amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              {errors.salary && (
                <Text className="text-red-500 text-xs mt-1">{errors.salary}</Text>
              )}
            </View>

            {/* Salary Date */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Salary Date (Day of month) *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.salaryDate ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.salaryDate}
                onChangeText={(value) => updateFormData('salaryDate', value)}
                placeholder="Enter day (1-31)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={2}
              />
              {errors.salaryDate && (
                <Text className="text-red-500 text-xs mt-1">{errors.salaryDate}</Text>
              )}
            </View>

            {/* Start Date */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Start Date *</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.startDate ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.startDate}
                onChangeText={(value) => updateFormData('startDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
              {errors.startDate && (
                <Text className="text-red-500 text-xs mt-1">{errors.startDate}</Text>
              )}
            </View>

            {/* End Date */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">End Date (Optional)</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.endDate}
                onChangeText={(value) => updateFormData('endDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email (Optional)</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: errors.email ? '#EF4444' : '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone (Optional)</Text>
              <TextInput
                style={{
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  borderColor: '#E5E7EB',
                }}
                className="border rounded-lg p-3"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Active Status */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium text-gray-700">Active Employee</Text>
                <Switch
                  value={formData.isActive}
                  onValueChange={(value) => updateFormData('isActive', value)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <GlassButton
                title="Cancel"
                onPress={onCancel}
                variant="secondary"
                style={{ flex: 1 }}
              />
              
              <GlassButton
                title={employee ? 'Update' : 'Save'}
                onPress={handleSave}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 