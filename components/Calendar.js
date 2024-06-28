import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { format, addDays } from 'date-fns';

const Calendar = ({ currentDate, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleDatePress = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const renderDates = () => {
    const dates = [];
    for (let i = -2; i <= 2; i++) {
      const date = addDays(currentDate, i);
      dates.push(
        <TouchableOpacity key={i} onPress={() => handleDatePress(date)}>
          <View
            style={[
              styles.dateContainer,
              date === selectedDate && styles.selectedDate,
            ]}
          >
            <Text style={styles.day}>{format(date, 'EEE')}</Text>
            <Text style={styles.date}>{format(date, 'd')}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return dates;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.calendar}
    >
      {renderDates()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  dateContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  day: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Calendar;
