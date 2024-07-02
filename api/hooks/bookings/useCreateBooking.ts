import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRoutes } from '../../routes';
import { api } from '../../api';
import { Alert } from 'react-native';
import { queryKeys } from '../../../constants/queryKeys';

const createBooking = async (clickedEventAndBookingObject) => {
  console.log(`clickedEventAndBookingObject:`, clickedEventAndBookingObject);
  const newClickedEventAndBookingObject = {
    ...clickedEventAndBookingObject,
  };

  try {
    const resp = await api.post(
      apiRoutes.bookings,
      newClickedEventAndBookingObject
    );

    if (resp.data.status === 'success') {
      Alert.alert('Success', 'Sessione prenotata');
      return true;
    }

    return resp.data.data;
  } catch (error) {
    Alert.alert('Error', error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.bookings] });
      await queryClient.cancelQueries({ queryKey: [queryKeys.events] });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKeys.bookings] });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};
