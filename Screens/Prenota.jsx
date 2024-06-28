import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Calendar from '../components/Calendar';
import EventsList from '../components/EventsList';
import { useEvents } from '../api/hooks/useEvents';
import { startOfDay, endOfDay } from 'date-fns';

const EventsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentDay = useCallback(
    () => startOfDay(currentDate),
    [currentDate]
  );
  const endOfCurrentDay = useCallback(
    () => endOfDay(currentDate),
    [currentDate]
  );

  const { dbEvents, isLoading, isFetching, updateView } = useEvents([
    startOfCurrentDay(),
    endOfCurrentDay(),
  ]);

  useEffect(() => {
    updateView([startOfCurrentDay(), endOfCurrentDay()]);
  }, [currentDate, startOfCurrentDay, endOfCurrentDay]);

  if (isLoading || isFetching) {
    return <Text>Loading sessions...</Text>;
  }

  return (
    <View style={styles.container}>
      <Calendar currentDate={currentDate} onDateChange={setCurrentDate} />
      <EventsList events={dbEvents} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default EventsPage;
