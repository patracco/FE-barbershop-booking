import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useEvents } from '../api/hooks/useEvents';
import { startOfDay, endOfDay, format, subDays, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import sessionColors from '../constants/sessionColors';

const EventsList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentDay = useCallback(
    () => startOfDay(currentDate),
    [currentDate]
  );
  const endOfCurrentDay = useCallback(
    () => endOfDay(currentDate),
    [currentDate]
  );

  const { dbEvents, isLoading, isFetching, isError, error, updateView } =
    useEvents([startOfCurrentDay(), endOfCurrentDay()]);

  useEffect(() => {
    updateView([startOfCurrentDay(), endOfCurrentDay()]);
  }, [currentDate, startOfCurrentDay, endOfCurrentDay, updateView]);

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const handleSelectSession = (session) => {
    console.log('Selected session:', session);
  };

  if (isLoading || isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='black' />
        <Text>Loading sessions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading sessions: {error.message}</Text>
      </View>
    );
  }

  const sessionsByTime = (Array.isArray(dbEvents) ? dbEvents : [])
    .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort events by start time
    .reduce((acc, session) => {
      const time = format(new Date(session.start), 'HH:mm', { locale: it });
      if (!acc[time]) acc[time] = [];
      acc[time].push(session);
      return acc;
    }, {});

  const sessionOrder = ['Strong', 'Lean', 'Fit', 'Reformer', 'Pilates'];

  return (
    <View style={styles.container}>
      <View style={styles.dateNavigator}>
        <TouchableOpacity
          onPress={handlePreviousDay}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          {Array.from({ length: 5 }, (_, index) => {
            const day = addDays(currentDate, index - 2);
            const isSelected =
              format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
            return (
              <TouchableOpacity key={index} onPress={() => setCurrentDate(day)}>
                <View
                  style={[
                    styles.dateCircle,
                    isSelected && styles.selectedDateCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedDateText,
                    ]}
                  >
                    {format(day, 'E', { locale: it })}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.selectedDateNumber,
                    ]}
                  >
                    {format(day, 'd', { locale: it })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity onPress={handleNextDay} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.sessionsContainer}>
        {Object.entries(sessionsByTime).map(([time, sessions]) => (
          <View key={time} style={styles.sessionGroup}>
            <Text style={styles.sessionTime}>{time}</Text>
            <View style={styles.sessionList}>
              {sessions
                .sort(
                  (a, b) =>
                    sessionOrder.indexOf(a.title) -
                    sessionOrder.indexOf(b.title)
                )
                .map((session) => {
                  const occupancy = session.bookings.length;
                  const capacity = session.maxGroupSize;
                  return (
                    <TouchableOpacity
                      key={session._id}
                      style={[
                        styles.sessionItem,
                        {
                          backgroundColor:
                            sessionColors[session.title] ||
                            sessionColors.default,
                        },
                      ]}
                      onPress={() => handleSelectSession(session)}
                    >
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text
                        style={styles.sessionOccupancy}
                      >{`${occupancy}/${capacity}`}</Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 40, // Adjusted to ensure margin at the top
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
    color: 'black',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 60,
    height: 60,
    marginHorizontal: 5,
  },
  selectedDateCircle: {
    backgroundColor: 'black',
  },
  dateText: {
    fontSize: 14,
  },
  selectedDateText: {
    color: 'white',
  },
  dateNumber: {
    fontSize: 14,
  },
  selectedDateNumber: {
    color: 'white',
  },
  sessionsContainer: {
    flex: 1,
  },
  sessionGroup: {
    marginBottom: 15,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sessionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sessionItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionOccupancy: {
    fontSize: 12,
    color: '#fff',
  },
});

export default EventsList;
