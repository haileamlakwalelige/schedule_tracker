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

// Salary date calculation functions
export const getDaysUntilSalary = (salaryDate: number): number => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let nextSalaryDate = new Date(currentYear, currentMonth, salaryDate);
  
  // If salary date has passed this month, calculate for next month
  if (currentDay > salaryDate) {
    nextSalaryDate = new Date(currentYear, currentMonth + 1, salaryDate);
  }
  
  const diffTime = nextSalaryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getSalaryDateText = (salaryDate: number): string => {
  const daysLeft = getDaysUntilSalary(salaryDate);
  
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
    const updatedHistory = employee.paymentHistory.map(p => 
      p.month === month 
        ? { ...p, status: 'paid', paidDate: new Date().toISOString(), amount, notes }
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
  const updatedHistory = employee.paymentHistory.map(p => 
    p.month === month 
      ? { ...p, status: 'unpaid', paidDate: '' }
      : p
  );
  return { ...employee, paymentHistory: updatedHistory };
}; 