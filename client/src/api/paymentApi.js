import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://<your-ip>:3000/payments'; // Replace <your-ip> with your NestJS IP

export const fetchPayments = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    throw error;
  }
};
