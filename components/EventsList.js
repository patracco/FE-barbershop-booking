import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const EventsList = ({ events }) => {
  const renderItem = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>
        {new Date(item.start).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  eventContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventsList;
