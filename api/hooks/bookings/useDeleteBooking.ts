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
  console.log(data);
  const { clickedBookingToDel, clickedEvent, isSessionSoon } = data;
  try {
    const resp = await api.delete(
      apiRoutes.bookings + `/${clickedBookingToDel._id}`
    );
    // const resp = await api.delete(
    //   apiRoutes.bookings + `/${clickedBookingToDel[0]._id}`,
    //   {
    //     data: { event: clickedEvent, isSessionSoon },
    //   }
    // );

    if (resp.status === 204) {
      Alert.alert('Booking rimosso con successo');
    }
  } catch (error) {
    Alert.alert(error.response.data.message);
  }
};

export const useDeleteBooking = (): UseMutateFunction<
  void,
  unknown,
  {
    clickedBookingToDel: Booking[];
    clickedEvent: Event;
    isSessionSoon: boolean;
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
        queryClient.getQueryData({ queryKey: [queryKeys.bookings] }) || [];
      const updatedBookings = previousBookings.filter(
        (b) => b._id !== data.clickedBookingToDel[0]._id
      );

      queryClient.setQueryData([queryKeys.bookings], updatedBookings);
      queryClient.setQueryData([queryKeys.events], updatedBookings);

      return { previousBookings };
    },
    onError: (error, variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData({
          queryKey: [queryKeys.bookings],
          data: context.previousBookings,
        });
      }
      Alert.alert(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bookings] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bookings] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
  return mutate;
};
