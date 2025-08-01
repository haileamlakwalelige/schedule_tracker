export interface Employee {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  salary: number;
  salaryDate: number; // Day of month (1-31)
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

export interface PinSettings {
  isEnabled: boolean;
  pin: string;
}

export interface AppSettings {
  pin: PinSettings;
  currency: 'ETB' | 'USD';
} 