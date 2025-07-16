// utils/storage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Cross-platform storage utility
export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.setItem(key, value);
    } else {
      // Use SecureStore for native platforms
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      return localStorage.getItem(key);
    } else {
      // Use SecureStore for native platforms
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.removeItem(key);
    } else {
      // Use SecureStore for native platforms
      await SecureStore.deleteItemAsync(key);
    }
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      // Clear localStorage for web
      localStorage.clear();
    } else {
      // For native platforms, you'd need to remove items individually
      // or implement a custom solution
      const keys = ['token', 'user']; // Add all your keys here
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
    }
  }
};

// Alternative: More secure web storage using crypto
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // For web, you can use sessionStorage (more secure) or localStorage
      // sessionStorage is cleared when tab is closed
      sessionStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return sessionStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      sessionStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};