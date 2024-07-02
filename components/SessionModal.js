import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { format } from 'date-fns'; // Import date-fns
import { it } from 'date-fns/locale';

const SessionModal = ({ isVisible, session, onBook, onClose }) => {
  if (!session) {
    return null;
  }

  const { title, start, end, istruttore, sala, maxGroupSize, bookings } =
    session;
  const spotsAvailable = maxGroupSize - bookings.length;
  const formattedStart = format(new Date(start), 'HH:mm', { locale: it });
  const formattedEnd = format(new Date(end), 'HH:mm', { locale: it });

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={styles.details}
        >{`Ora: ${formattedStart} - ${formattedEnd}`}</Text>
        <Text style={styles.details}>{`Trainer: ${istruttore}`}</Text>
        <Text style={styles.details}>{`Sala: ${sala}`}</Text>
        <Text
          style={styles.details}
        >{`Posti: ${spotsAvailable}/${maxGroupSize}`}</Text>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={onBook} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Prenota</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'left',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SessionModal;
