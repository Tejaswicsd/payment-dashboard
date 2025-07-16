// TransactionListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, Alert,
  SafeAreaView, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ApiService, { Payment, TransactionFilters } from '../services/api';
import TransactionCard from '../components/TransactionCard';

type TransactionListScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 'TransactionList'>;

interface Props {
  navigation: TransactionListScreenNavigationProp;
}

const TransactionListScreen: React.FC<Props> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    method: undefined,
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [filterForm, setFilterForm] = useState({
    status: '',
    method: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const isLoadMore = filters.page !== 1;
    loadTransactions(isLoadMore);
  }, [JSON.stringify(filters)]); // Ensures deep comparison

  const loadTransactions = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await ApiService.getPayments(filters);

      setCurrentPage(response.page);
      setTotalPages(response.totalPages);

      setTransactions(prev =>
        isLoadMore ? [...prev, ...response.data] : response.data
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setFilters(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) + 1,
      }));
    }
  };

  const applyFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: filterForm.status || undefined,
      method: filterForm.method || undefined,
      dateFrom: filterForm.dateFrom || undefined,
      dateTo: filterForm.dateTo || undefined,
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilterForm({
      status: '',
      method: '',
      dateFrom: '',
      dateTo: '',
    });
    setFilters({
      page: 1,
      limit: 10,
      status: undefined,
      method: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
    setShowFilters(false);
  };

  const renderTransaction = ({ item }: { item: Payment }) => (
    <TransactionCard
      transaction={item}
      onPress={() =>
        navigation.navigate('TransactionDetails', { transactionId: item.id })
      }
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No transactions found</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPayment')}
      >
        <Text style={styles.addButtonText}>Add Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => (
    <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filter Transactions</Text>
          <TouchableOpacity onPress={applyFilters}>
            <Text style={styles.modalApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {/* Status */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {['', 'success', 'failed', 'pending'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filterForm.status === status && styles.filterOptionActive,
                  ]}
                  onPress={() =>
                    setFilterForm(prev => ({ ...prev, status }))
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filterForm.status === status && styles.filterOptionTextActive,
                    ]}
                  >
                    {status || 'All'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Method */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Method</Text>
            <View style={styles.filterOptions}>
              {['', 'credit_card', 'debit_card', 'paypal', 'bank_transfer'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.filterOption,
                    filterForm.method === method && styles.filterOptionActive,
                  ]}
                  onPress={() =>
                    setFilterForm(prev => ({ ...prev, method }))
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filterForm.method === method && styles.filterOptionTextActive,
                    ]}
                  >
                    {method ? method.replace('_', ' ') : 'All'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date range */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <TextInput
              style={styles.dateInput}
              value={filterForm.dateFrom}
              onChangeText={(text) =>
                setFilterForm((prev) => ({ ...prev, dateFrom: text }))
              }
              placeholder="From (YYYY-MM-DD)"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              style={styles.dateInput}
              value={filterForm.dateTo}
              onChangeText={(text) =>
                setFilterForm((prev) => ({ ...prev, dateTo: text }))
              }
              placeholder="To (YYYY-MM-DD)"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
          ) : null
        }
      />

      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  filterButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonText: { color: '#fff' },
  emptyState: { alignItems: 'center', marginTop: 32 },
  emptyStateText: { marginBottom: 8 },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelText: { color: 'red' },
  modalTitle: { fontWeight: 'bold', fontSize: 18 },
  modalApplyText: { color: 'green' },
  modalContent: { padding: 16 },
  filterGroup: { marginBottom: 16 },
  filterLabel: { fontWeight: 'bold', marginBottom: 8 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterOption: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterOptionText: { color: '#374151' },
  filterOptionTextActive: { color: '#fff' },
  dateInput: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 12,
    padding: 10,
  },
  clearButtonText: { color: 'red' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  loadingMore: { padding: 12, alignItems: 'center' },
  loadingMoreText: { fontSize: 14, color: '#6b7280' },
  listContent: { padding: 16 },
});

export default TransactionListScreen;
