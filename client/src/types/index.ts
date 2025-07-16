export interface User {
 id: string;
 username: string;
 email: string;
 role: 'admin' | 'viewer';
}
export interface Payment {
 id: string;
 amount: number;
 receiver: string;
 status: 'success' | 'failed' | 'pending';
 method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'upi';
 description: string;
 transactionId: string;
 createdAt: string;
 updatedAt: string;
}
export interface PaymentStats {
 todayPayments: number;
 weekPayments: number;
 totalRevenue: number;
 failedTransactions: number;
}
export interface AuthResponse {
 access_token: string;
 user: User;
}