import { Employee, PaymentRecord } from '../types/employee';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number, currency: string = 'ETB'): string => {
  if (currency === 'ETB') {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateTotalSalary = (employees: Employee[]): number => {
  return employees
    .filter(emp => emp.isActive)
    .reduce((total, emp) => total + emp.salary, 0);
};

export const getActiveEmployees = (employees: Employee[]): Employee[] => {
  return employees.filter(emp => emp.isActive);
};

export const getInactiveEmployees = (employees: Employee[]): Employee[] => {
  return employees.filter(emp => !emp.isActive);
};

export const searchEmployees = (employees: Employee[], query: string): Employee[] => {
  const lowercaseQuery = query.toLowerCase();
  return employees.filter(emp => 
    emp.name.toLowerCase().includes(lowercaseQuery) ||
    emp.position.toLowerCase().includes(lowercaseQuery) ||
    emp.department.toLowerCase().includes(lowercaseQuery) ||
    emp.email?.toLowerCase().includes(lowercaseQuery)
  );
};

// Salary cycle calculation functions based on start and end dates
export const getCurrentSalaryCycle = (startDate: string, endDate: string): {
  currentStart: string;
  currentEnd: string;
  isActive: boolean;
} => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If today is within the current cycle
  if (today >= start && today <= end) {
    return {
      currentStart: startDate,
      currentEnd: endDate,
      isActive: true
    };
  }
  
  // If today is after the end date, calculate next cycle
  if (today > end) {
    const cycleDuration = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(cycleDuration / (1000 * 60 * 60 * 24));
    
    // Calculate next cycle start (from previous end date)
    const nextStart = new Date(end);
    nextStart.setDate(end.getDate() + 1); // Start from day after previous end
    
    // Calculate next cycle end
    const nextEnd = new Date(nextStart);
    nextEnd.setDate(nextStart.getDate() + daysDiff - 1); // Subtract 1 to maintain same duration
    
    return {
      currentStart: nextStart.toISOString().split('T')[0],
      currentEnd: nextEnd.toISOString().split('T')[0],
      isActive: true
    };
  }
  
  // If today is before the start date
  return {
    currentStart: startDate,
    currentEnd: endDate,
    isActive: false
  };
};

export const getDaysUntilSalary = (startDate: string, endDate: string): number => {
  const cycle = getCurrentSalaryCycle(startDate, endDate);
  const today = new Date();
  const salaryEndDate = new Date(cycle.currentEnd);
  
  const diffTime = salaryEndDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getSalaryDateText = (startDate: string, endDate: string): string => {
  const daysLeft = getDaysUntilSalary(startDate, endDate);
  const cycle = getCurrentSalaryCycle(startDate, endDate);
  
  if (!cycle.isActive) {
    const start = new Date(cycle.currentStart);
    const daysUntilStart = Math.ceil((start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return `Salary cycle starts in ${daysUntilStart} days`;
  }
  
  if (daysLeft === 0) {
    return 'Salary day is today!';
  } else if (daysLeft === 1) {
    return 'Salary day is tomorrow!';
  } else if (daysLeft < 0) {
    return `Salary day was ${Math.abs(daysLeft)} days ago`;
  } else {
    return `${daysLeft} days until salary`;
  }
};

export const getSalaryCycleInfo = (startDate: string, endDate: string): {
  cycleStart: string;
  cycleEnd: string;
  totalDays: number;
  daysRemaining: number;
  progress: number;
  isActive: boolean;
} => {
  const cycle = getCurrentSalaryCycle(startDate, endDate);
  const today = new Date();
  const start = new Date(cycle.currentStart);
  const end = new Date(cycle.currentEnd);
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
  
  return {
    cycleStart: cycle.currentStart,
    cycleEnd: cycle.currentEnd,
    totalDays,
    daysRemaining: Math.max(daysRemaining, 0),
    progress: Math.round(progress),
    isActive: cycle.isActive
  };
};

// Payment history functions
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

export const getPaymentStatus = (employee: Employee, month: string): 'paid' | 'unpaid' => {
  const payment = employee.paymentHistory.find(p => p.month === month);
  return payment?.status || 'unpaid';
};

export const getPaymentRecord = (employee: Employee, month: string): PaymentRecord | null => {
  return employee.paymentHistory.find(p => p.month === month) || null;
};

export const markAsPaid = (employee: Employee, month: string, amount: number, notes?: string): Employee => {
  const existingPayment = employee.paymentHistory.find(p => p.month === month);
  
  if (existingPayment) {
    // Update existing payment
    const updatedHistory: PaymentRecord[] = employee.paymentHistory.map(p => 
      p.month === month 
        ? { ...p, status: 'paid' as const, paidDate: new Date().toISOString(), amount, notes }
        : p
    );
    return { ...employee, paymentHistory: updatedHistory };
  } else {
    // Add new payment record
    const newPayment: PaymentRecord = {
      id: generateId(),
      month,
      amount,
      paidDate: new Date().toISOString(),
      status: 'paid',
      notes,
    };
    return { 
      ...employee, 
      paymentHistory: [...employee.paymentHistory, newPayment] 
    };
  }
};

export const markAsUnpaid = (employee: Employee, month: string): Employee => {
  const updatedHistory: PaymentRecord[] = employee.paymentHistory.map(p => 
    p.month === month 
      ? { ...p, status: 'unpaid' as const, paidDate: '' }
      : p
  );
  return { ...employee, paymentHistory: updatedHistory };
}; 