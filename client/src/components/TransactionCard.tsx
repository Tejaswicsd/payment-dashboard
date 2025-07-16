// src/components/TransactionCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Payment } from '../services/api';
import {
  getStatusColor,
  getMethodIcon,
  formatDate,
  formatCurrency,
} from '../utils/helpers';

interface Props {
  transaction: Payment;
  onPress: () => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, onPress }) => {
  const statusColor = getStatusColor(transaction.status);
  const methodIcon = getMethodIcon(transaction.method);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.methodIcon}>{methodIcon}</Text>
          <View style={styles.details}>
            <Text style={styles.receiver} numberOfLines={1}>
              To: {transaction.receiver}
            </Text>
            <Text style={styles.date}>
              {formatDate(transaction.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>
            {formatCurrency(transaction.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {transaction.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.method}>
          {transaction.method.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.transactionId}>
          ID: {transaction.id.substring(0, 8)}...
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  receiver: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  method: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366f1',
  },
  transactionId: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default TransactionCard;
