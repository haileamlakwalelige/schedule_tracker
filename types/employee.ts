export interface Employee {
  id: string;
  name: string;
  startDate: string;
  endDate: string; // Required for salary cycle calculation
  salary: number;
  salaryDate: number; // Legacy field, kept for compatibility
  position: string;
  department: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  paymentHistory: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  month: string; // Format: "YYYY-MM"
  amount: number;
  paidDate: string;
  status: 'paid' | 'unpaid';
  notes?: string;
}

export interface AppSettings {
  currency: 'ETB' | 'USD';
} 