import * as SecureStore from 'expo-secure-store';

const tokenKey = 'auth_token'; // Changed from 'sst_token' to match demo mode

export const getAuthToken = async () => SecureStore.getItemAsync(tokenKey);

export const setAuthToken = async (token: string) =>
  SecureStore.setItemAsync(tokenKey, token);

export const clearAuthToken = async () => SecureStore.deleteItemAsync(tokenKey);
