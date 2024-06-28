import { apiRoutes } from '../routes';
import { api } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { setStoredMe } from '../user-storage';
import { Alert } from 'react-native';

export function useAuth() {
  const queryClient = useQueryClient();

  const login = async (email, password) => {
    try {
      const resp = await api.post(apiRoutes.login, { email, password });

      // Log the full response to check its structure
      console.log('Full response:', resp);

      const user = resp.data?.data?.user;
      console.log('User:', user);

      if (resp.data?.status === 'success') {
        await AsyncStorage.setItem('token', resp.data.token); // Store token in AsyncStorage
        queryClient.setQueryData(['me'], user);
        setStoredMe(user);
        Alert.alert('Benvenuto!');
        return resp.data;
      } else {
        console.log('Response status is not success:', resp.data.status);
        Alert.alert('Credenziali non valide');
      }
    } catch (error) {
      console.log('Error during login:', error);
      Alert.alert('Credenziali non valide');
    }
  };

  const signup = async (user, myRoles = ['user']) => {
    const resp = await api.post(apiRoutes.signup, user);
    if (!myRoles.includes('admin') && !myRoles.includes('trainer')) {
      Alert.alert('User added successfully'); // Replace toast with Alert for React Native
    } else {
      Alert.alert('User added successfully'); // Replace toast with Alert for React Native
    }
  };

  const verifyEmail = async (verificationCode) => {
    try {
      const resp = await api.post('users/verify', {
        id: verificationCode,
      });
      if (resp.data.status === 'success') {
        Alert.alert('Email verificata'); // Replace toast with Alert for React Native
        return resp.data;
      }
    } catch (error) {
      Alert.alert(error.response.data.message); // Replace toast with Alert for React Native
    }
  };

  return {
    login,
    signup,
    verifyEmail,
  };
}
