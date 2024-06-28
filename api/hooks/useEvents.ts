import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { format, startOfDay, endOfDay } from 'date-fns';
import { apiRoutes } from '../../api/routes';

// const apiRoutes = {
//   events: 'https://your-api-url.com/events',
// };

const commonOptions = {
  staleTime: 0,
  cacheTime: 300000, // 5 minutes
};

// Function to fetch events from the API
async function getEvents(dates) {
  const token = await AsyncStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const [start, end] = dates;
    const response = await axios.get(apiRoutes.events, {
      params: { start, end },
      ...config,
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Custom hook to manage fetching and updating events
export const useEvents = (dates) => {
  const [startView, setStartView] = useState(dates[0]);
  const [endView, setEndView] = useState(dates[1]);

  const queryClient = useQueryClient();

  const {
    data: dbEvents = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['events', startView, endView],
    queryFn: () => getEvents([startView, endView]),
    initialData: [],
    ...commonOptions,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // 60 seconds
    onSuccess: (data) => {
      queryClient.setQueryData(['events'], data);
    },
  });

  // Function to update the date range for fetching events
  const updateView = (newDates) => {
    setStartView(newDates[0]);
    setEndView(newDates[1]);
  };

  return {
    dbEvents,
    isLoading,
    isFetching,
    updateView,
  };
};
