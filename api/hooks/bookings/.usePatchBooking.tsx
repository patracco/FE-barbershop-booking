import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type { Id, Booking, Bookings } from '../../../api/types';
import { axiosInstance } from '../../axiosInstance';
import { queryKeys } from '../../react-query/constants';
// import { useCustomToast } from '../../app/hooks/useCustomToast';
import { apiRoutes } from '../../../../routes';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

async function patchBookingOnServer(newData: Object): Promise<Booking | null> {
  if (!newData) return null;
  // const { id, isCheckedIn, userId } = newData;
  console.log(newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    apiRoutes.bookings + `/${newData.id}`,
    newData,
    {
      headers: {
        Authorization: Cookies.get('token'),
      },
    }
  );
  return data.data;
}

export function usePatchBooking(): UseMutateFunction<
  Booking,
  unknown,
  Booking,
  unknown
> {
  const queryClient = useQueryClient();
  const { mutate: patchBooking } = useMutation(
    (newData: Booking) => patchBookingOnServer(newData),
    {
      onMutate: async (newData: Booking | null) => {
        await queryClient.cancelQueries([queryKeys.bookings]);
      },
      onError: (error, newData, context) => {
        // Handle errors and rollback cache if necessary
        // console.error(error);
      },
      onSuccess: async (bookingData: Booking | null, newData, context) => {
        await queryClient.invalidateQueries([queryKeys.bookings]);
        await queryClient.invalidateQueries([queryKeys.events]);
      },
      onSettled: async (data, error, newData, context) => {
        await queryClient.invalidateQueries([queryKeys.bookings]);
        await queryClient.invalidateQueries([queryKeys.events]);
      },
    }
  );

  return patchBooking;
}
