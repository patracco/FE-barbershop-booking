import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEvents } from '../api/hooks/useEvents';
import { startOfDay, endOfDay, format, subDays, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import sessionColors from '../constants/sessionColors';
import SessionModal from '../components/SessionModal';
import { useCreateBooking } from '../api/hooks/bookings/useCreateBooking';
import { useDeleteBooking } from '../api/hooks/bookings/useDeleteBooking';
import { canUserBookEvent } from '../api/utils/canUserBookEvent';
import { useMe } from '../api/hooks/useMe';
import DeleteModal from '../components/DeleteModal';

const Prenota = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clickedEvent, setClickedEvent] = useState();
  const [clickedBookingToDel, setClickedBookingToDel] = useState();
  const [bookingObject, setBookingObject] = useState({
    sessionId: '',
    sessionName: '',
    user: '',
    start: '',
    end: '',
  });
  const [onWaitingList, setOnWaitingList] = useState();
  const [slotsAvailable, setSlotsAvailable] = useState();
  const [isSessionSoon, setIsSessionSoon] = useState();
  const [dayTime, setDayTime] = useState();

  const { me } = useMe();
  const { mutate: createBooking } = useCreateBooking();
  const deleteBooking = useDeleteBooking();
  // const patchEvent = usePatchEvent();

  const calculateIsSessionSoon = (event) => {
    const now = new Date();
    const start = new Date(event.start);
    return start - now < 14 * 60 * 60 * 1000; // Less than 14 hours
  };

  // const isSessionBookedByUser = (session) => {
  //   const isBooked = session.bookings.some(
  //     (booking) => booking.user._id === me._id
  //   );
  //   console.log('Is session booked by user:', isBooked);
  //   return isBooked;
  // };

  const addToWaitlist = async () => {
    const updatedEvent = {
      addToWaitingList: me._id, // Specify the user to be added
    };

    try {
      // await patchEvent({ eventId: clickedEvent._id, updatedEvent });
      Alert.alert('Success', 'Aggiunto alla waiting list');
    } catch (error) {
      Alert.alert('Error', 'Error updating the waiting list.');
    }
  };

  const removeFromWaitingList = async () => {
    const updatedEvent = {
      removeFromWaitingList: me._id, // Specify the user to be removed
    };

    try {
      // await patchEvent({ eventId: clickedEvent._id, updatedEvent });
      Alert.alert('Success', 'Rimosso dalla waiting list');
    } catch (error) {
      Alert.alert('Error', 'Error updating the waiting list.');
    }
  };

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

  const onSelectEvent = (event) => {
    console.log(event);
    setClickedEvent(event);
    setSlotsAvailable(event?.maxGroupSize - event?.bookings.length);
    setOnWaitingList(event?.waitingList.includes(me?._id));

    const isSoon = calculateIsSessionSoon(event);
    setIsSessionSoon(isSoon);

    const bookingObj = {
      session: event?._id,
      sessionName: event?.title,
      user: me?._id,
      stripeCustomerId: me?.stripeCustomerId,
      start: event?.start,
      end: event?.end,
    };
    setBookingObject(bookingObj);
    setSessionModalOpen(true);

    if (typeof event?.bookings !== null && event?.bookings.length > 0) {
      const booking = event?.bookings.filter((b) => {
        return (
          b.user._id === me?._id &&
          new Date(b.start).toString() === event?.start.toString() &&
          b.sessionName === event?.title
        );
      });

      if (booking.length > 0) {
        setClickedBookingToDel(booking);
        if (isSoon) {
          setWarningModalOpen(true);
        } else {
          setDeleteModalOpen(true);
        }
      }
    }
  };

  const onSubmit = async () => {
    if (slotsAvailable >= 1) {
      createBooking(bookingObject);

      if (clickedEvent?.waitingList.includes(me?._id)) {
        removeFromWaitingList();
      }
    }

    if (slotsAvailable === 0) {
      if (!onWaitingList) {
        addToWaitlist();
      } else {
        if (clickedEvent?.waitingList.includes(me?._id)) {
          removeFromWaitingList();
        }
      }
    }
    setSessionModalOpen(false);
  };

  const onSubmitDelete = () => {
    if (slotsAvailable === 0 && clickedEvent.waitingList.length > 0) {
      deleteBooking({ clickedBookingToDel, clickedEvent });

      const smsText = `si è liberato un posto per ${
        clickedEvent?.title
      } il ${dayTime}, prenota subito per non perdere l'occasione! ${
        clickedEvent?.title === 'Pilates' || clickedEvent?.title === 'Reformer'
          ? 'Reformer Pilates'
          : 'Perform Training'
      }`;
      useSMS(clickedEvent, smsText);
    }
    deleteBooking({ clickedBookingToDel, clickedEvent, isSessionSoon });
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
    .sort((a, b) => new Date(a.start) - new Date(b.start))
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
                      onPress={() => onSelectEvent(session)}
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
      <SessionModal
        isVisible={sessionModalOpen}
        session={clickedEvent}
        onBook={onSubmit}
        onClose={() => setSessionModalOpen(false)}
      />
      {/* <DeleteWarningModal
        warningModalOpen={warningModalOpen}
        setWarningModalOpen={setWarningModalOpen}
        onSubmitDelete={onSubmitDelete}
      /> */}
      <DeleteModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        onSubmitDelete={onSubmitDelete}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 40,
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

export default Prenota;
