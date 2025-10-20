import api from './api';
import { Payment, CreatePaymentData, ProcessPaymentData, PaginatedResponse } from '../types';

export const paymentService = {
  async createPayment(data: CreatePaymentData): Promise<{ success: boolean; data: { payment: Payment } }> {
    const response = await api.post('/payments', data);
    return response.data;
  },

  async processPayment(
    paymentId: string,
    data: ProcessPaymentData
  ): Promise<{ success: boolean; data: { payment: Payment } }> {
    const response = await api.post(`/payments/${paymentId}/process`, data);
    return response.data;
  },

  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ success: boolean; data: PaginatedResponse<Payment> }> {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },

  async getPaymentById(id: string): Promise<{ success: boolean; data: Payment }> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async refundPayment(id: string, refundAmount?: number, refundReason?: string): Promise<{ success: boolean; data: { payment: Payment } }> {
    const response = await api.post(`/payments/${id}/refund`, { refundAmount, refundReason });
    return response.data;
  },
};