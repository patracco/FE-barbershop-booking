import { useQuery, useQueryClient, QueryCache } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import type { IUser, Bookings, GetSessionResponse } from '../../types';
import { axiosInstance } from '../../axiosInstance';
import { queryKeys } from '../../react-query/constants';
import { getStoredBookings, setStoredBookings } from '../../user-storage';
import { apiRoutes } from '../../../../routes';
import Cookies from 'js-cookie';

const commonOptions = {
  staleTime: 0,
  cacheTime: 300000, // 5 minutes
};

async function getBookings(): Promise<Bookings> {
  try {
    const { data }: AxiosResponse<GetSessionResponse> = await axiosInstance.get(
      apiRoutes.bookings,
      {
        // signal,
        headers: {
          Authorization: Cookies.get('token'),
        },
      }
    );
    return data.data.data;
  } catch (error) {
    console.log(error.response.data.message);
  }
}

export const useBookings = (): Bookings => {
  const queryClient = useQueryClient();
  const fallback = [];
  const {
    data: bookings = fallback,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
  } = useQuery([queryKeys.bookings], () => getBookings(), {
    // this is causing issues in production
    // initialData: getStoredBookings,

    // select: showAll ? (data) => identity<AppointmentDateMap>(data) : selectFn,
    ...commonOptions,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // 60 seconds

    onSuccess: (received: null | Bookings) => {
      // console.log(received);
      if (!received) {
        // clearStoredUser();
      } else {
        // queryClient.invalidateQueries([queryKeys.bookings]);
        setStoredBookings(received);
        queryClient.setQueryData([queryKeys.bookings], received);
      }
    },
  });

  // const updateBookings = (newBookings: Bookings): void => {
  //   // update the bookings cache
  //   console.log(`new bookings: `, newBookings);
  //   queryClient.setQueryData([queryKeys.bookings], newBookings);
  // };

  return {
    bookings,
    isBookingsLoading,
    isBookingsFetching,
    // updateBookings,
  };
};
