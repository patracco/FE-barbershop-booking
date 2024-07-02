import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { apiRoutes } from '../../api/routes';
import { api } from '../api';

const commonOptions = {
  staleTime: 0,
  cacheTime: 300000, // 5 minutes
};

async function getEvents(dates) {
  try {
    const [start, end] = dates;
    const response = await api.get(apiRoutes.events, {
      params: { start, end },
    });
    // console.log('API response:', response.data.data.data);
    return response.data.data.data || [];
  } catch (error) {
    console.error('API error:', error.message);
    return [];
  }
}

export const useEvents = (dates) => {
  const [startView, setStartView] = useState(dates[0]);
  const [endView, setEndView] = useState(dates[1]);

  const queryClient = useQueryClient();

  const queryKey = ['events', startView, endView];
  const queryFn = () => getEvents([startView, endView]);

  const {
    data: dbEvents = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn,
    initialData: [],
    ...commonOptions,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    onSuccess: (data) => {
      console.log('Query success:', data);
      queryClient.setQueryData(queryKey, data);
    },
    onError: (error) => {
      console.error('Query error:', error.message);
    },
  });

  const updateView = useCallback((newDates) => {
    setStartView(newDates[0]);
    setEndView(newDates[1]);
  }, []);

  return {
    dbEvents,
    isLoading,
    isFetching,
    isError,
    error,
    updateView,
  };
};
