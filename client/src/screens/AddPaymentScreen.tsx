// src/screens/AddPaymentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ApiService, { CreatePaymentRequest } from '../services/api';

type AddPaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPayment'>;

interface Props {
  navigation: AddPaymentScreenNavigationProp;
}

const AddPaymentScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<CreatePaymentRequest>({
    amount: 0,
    receiver: '',
    description: '',
    status: 'pending',
    method: 'credit_card',
  });

  const [loading, setLoading] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'crypto', label: 'Cryptocurrency' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
  ];

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2 || (parts[1]?.length > 2)) return;

    setAmountInput(cleaned);
    setFormData(prev => ({
      ...prev,
      amount: parseFloat(cleaned) || 0,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.receiver.trim()) {
      Alert.alert('Error', 'Please enter receiver name');
      return;
    }

    if (formData.amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const newPayment = await ApiService.createPayment(formData);
      Alert.alert('Success', 'Payment created successfully!', [
        {
          text: 'View Details',
          onPress: () =>
            navigation.replace('TransactionDetails', {
              transactionId: newPayment.id,
            }),
        },
        {
          text: 'Create Another',
          onPress: () => {
            setFormData({
              amount: 0,
              receiver: '',
              description: '',
              status: 'pending',
              method: 'credit_card',
            });
            setAmountInput('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create payment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderOptionSelector = (
    title: string,
    options: { value: string; label: string }[],
    selected: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selected === option.value && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Add New Payment</Text>

          <Text style={styles.label}>Receiver</Text>
          <TextInput
            style={styles.input}
            value={formData.receiver}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, receiver: text }))
            }
            placeholder="Enter receiver name"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amountInput}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, description: text }))
            }
            placeholder="Enter description"
          />

          {renderOptionSelector('Payment Method', paymentMethods, formData.method, method =>
            setFormData(prev => ({ ...prev, method }))
          )}

          {renderOptionSelector('Status', statusOptions, formData.status, status =>
            setFormData(prev => ({ ...prev, status }))
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit Payment'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
  },
  selectorContainer: { marginTop: 15 },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: { color: '#333' },
  selectedOptionText: { color: '#fff' },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
