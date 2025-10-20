export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  amount: number;
  commission: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
  transactionId: string;
  paymentDate?: string;
  refundAmount: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  appointment?: any;
  patient?: any;
  doctor?: any;
}

export interface CreatePaymentData {
  appointmentId: string;
  amount: number;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
  metadata?: Record<string, any>;
}

export interface ProcessPaymentData {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionDetails?: Record<string, any>;
}