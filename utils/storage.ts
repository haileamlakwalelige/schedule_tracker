import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee, AppSettings } from '../types/employee';

const STORAGE_KEYS = {
  EMPLOYEES: 'employees',
  SETTINGS: 'settings',
};

export const StorageService = {
  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  },

  async saveEmployees(employees: Employee[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  },

  async addEmployee(employee: Employee): Promise<void> {
    const employees = await this.getEmployees();
    employees.push(employee);
    await this.saveEmployees(employees);
  },

  async updateEmployee(updatedEmployee: Employee): Promise<void> {
    const employees = await this.getEmployees();
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      await this.saveEmployees(employees);
    }
  },

  async deleteEmployee(id: string): Promise<void> {
    const employees = await this.getEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    await this.saveEmployees(filteredEmployees);
  },

  // Settings operations
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        currency: 'ETB'
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        currency: 'ETB'
      };
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },


}; 