import { queryKeys } from '../../../constants/queryKeys';
import { apiRoutes } from '../../routes';
import { Alert } from 'react-native';
import { api } from '../../api';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const deleteBooking = async (data) => {
  const { clickedBookingToDel, clickedEvent, isSoon } = data;
  const newData = {
    clickedEvent,
    isSoon,
  };
  try {
    const resp = await api.delete(
      apiRoutes.bookings + `/${clickedBookingToDel._id}`,
      newData
    );

    if (resp.status === 204) {
      Alert.alert('Booking rimosso con successo');
      return true;
    }
  } catch (error) {
    Alert.alert(error.response.data.message);
    return false;
  }
};

export const useDeleteBooking = (): UseMutateFunction<
  void,
  unknown,
  {
    clickedBookingToDel: Booking[];
    clickedEvent: Event;
    isSoon: boolean;
  },
  unknown
> => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => deleteBooking(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.bookings] });

      // Snapshot the previous value
      const previousBookings =
        (await queryClient.getQueryData({ queryKey: [queryKeys.bookings] })) ||
        [];
      const updatedBookings = previousBookings.filter(
        (b) => b._id !== data.clickedBookingToDel._id
      );

      await queryClient.setQueryData({
        queryKey: [queryKeys.bookings],
        data: updatedBookings,
      });
      await queryClient.setQueryData({
        queryKey: [queryKeys.events],
        data: updatedBookings,
      });

      return { previousBookings };
    },
    onError: async (error, variables, context) => {
      if (context?.previousBookings) {
        await queryClient.setQueryData({
          queryKey: [queryKeys.bookings],
          data: context.previousBookings,
        });
      }
      Alert.alert(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKeys.bookings] });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKeys.bookings] });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
  return mutate;
};
