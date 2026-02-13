import api from './api';
import { Payment, CreatePaymentData, ProcessPaymentData, PaginatedResponse } from '../types';

export const paymentService = {
  async createPayment(data: CreatePaymentData): Promise<{ success: boolean; data: { payment: Payment } }> {
    try {
      console.log('💰 Création d\'un paiement:', data);
      const response = await api.post('/payments', data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création paiement:', error);
      throw error;
    }
  },

  async processPayment(
    paymentId: string,
    data: ProcessPaymentData
  ): Promise<{ success: boolean; data: { payment: Payment } }> {
    try {
      console.log(`💰 Traitement du paiement ${paymentId}:`, data);
      const response = await api.post(`/payments/${paymentId}/process`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur traitement paiement:', error);
      throw error;
    }
  },

  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ success: boolean; data: PaginatedResponse<Payment> }> {
    try {
      const response = await api.get('/payments/history', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération historique paiements:', error);
      throw error;
    }
  },

  async getPaymentById(id: string): Promise<{ success: boolean; data: Payment }> {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération paiement:', error);
      throw error;
    }
  },

  async refundPayment(id: string, refundAmount?: number, refundReason?: string): Promise<{ success: boolean; data: { payment: Payment } }> {
    try {
      console.log(`💰 Remboursement du paiement ${id}:`, { refundAmount, refundReason });
      const response = await api.post(`/payments/${id}/refund`, { refundAmount, refundReason });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur remboursement:', error);
      throw error;
    }
  },

  // ✅ AJOUT : Simuler un paiement pour le développement
  async simulatePayment(amount: number): Promise<{ success: boolean; transactionId: string }> {
    console.log(`💰 Simulation de paiement de ${amount}€...`);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      transactionId: `SIM_${Date.now()}`
    };
  }
};
