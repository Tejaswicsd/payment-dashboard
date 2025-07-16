import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Payment } from '../types'; // Make sure this file exists with the correct interface

interface PaymentCardProps {
  payment: Payment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Text style={styles.amount}>${payment.amount}</Text>
        <Text style={styles.receiver}>{payment.receiver}</Text>
        <Text style={styles.method}>{payment.method.replace('_', ' ').toUpperCase()}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.status, { color: getStatusColor(payment.status) }]}>
          {payment.status.toUpperCase()}
        </Text>
        <Text style={styles.date}>
          {new Date(payment.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  receiver: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  method: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
