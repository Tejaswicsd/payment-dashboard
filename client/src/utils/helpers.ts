// src/utils/helpers.ts

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'success':
      return '#28a745'; // Green
    case 'failed':
      return '#dc3545'; // Red
    case 'pending':
      return '#ffc107'; // Yellow
    default:
      return '#6c757d'; // Gray
  }
};

export const getMethodIcon = (method: string): string => {
  switch (method.toLowerCase()) {
    case 'credit_card':
      return '💳';
    case 'debit_card':
      return '🏦';
    case 'paypal':
      return '🅿️';
    case 'bank_transfer':
      return '🏛️';
    case 'crypto':
      return '₿';
    default:
      return '💰';
  }
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' ' + d.toLocaleTimeString('en-US');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
