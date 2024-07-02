import { AxiosResponse } from 'axios';
import type { IUser, UseUser } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { clearStoredMe, getStoredMe, setStoredMe } from '../user-storage';

// query function
async function getMe(): Promise<IUser | null> {
  try {
    const token = await AsyncStorage.getItem('token');
    const { data }: AxiosResponse<{ user: IUser }> = await api.get(
      `/users/me`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    // console.log('API response data:', data.data.doc);
    return data.data.doc; // Adjusted to directly return data.user
  } catch (error) {
    console.error(error);
    return null; // Return null in case of an error
  }
}

const fallback = {} as IUser; // Adjusted to properly type fallback as IUser

export const useMe = (): UseUser => {
  const queryClient = useQueryClient();
  const {
    data: me = fallback,
    isLoading: loadingMe,
    isFetching: fetchingMe,
  } = useQuery({
    queryKey: [queryKeys.me],
    queryFn: getMe,
    initialData: getStoredMe,
    onSuccess: async (received: IUser | null) => {
      if (!received) {
        clearStoredMe();
      } else {
        setStoredMe(received);
        await queryClient.setQueryData({ queryKey: [queryKeys.me] }, received);
      }
    },
  });

  // Meant to be called from useAuth
  async function updateMe(newMe: IUser): void {
    await queryClient.setQueryData({ queryKey: [queryKeys.me] }, newMe);
  }

  // Meant to be called from useAuth
  async function clearMe() {
    await queryClient.removeQueries({ queryKey: [queryKeys.me] });
  }

  return {
    me,
    loadingMe,
    fetchingMe,
    updateMe,
    clearMe,
  };
};
