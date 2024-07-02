import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const DeleteWarningModal = ({ isVisible, onClose, onDelete }) => (
  <Modal isVisible={isVisible} onBackdropPress={onClose}>
    <View style={styles.modalContent}>
      <Text style={styles.warningText}>
        Attenzione: mancano meno di 2 ore all'inizio della sessione. La
        cancellazione non restituirà il credito.
      </Text>
      <View style={styles.buttons}>
        <Button title='Cancella' onPress={onClose} />
        <Button title='Ok, procedi comunque' onPress={onDelete} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'red',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DeleteWarningModal;
