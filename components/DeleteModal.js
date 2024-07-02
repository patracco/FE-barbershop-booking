// DeleteModal.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const DeleteModal = ({ isVisible, onClose, onDelete }) => (
  <Modal isVisible={isVisible}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>
        Vuoi rimuovere la prenotazione in questo slot?
      </Text>
      <Text>Elimina la prenotazione in questo slot.</Text>
      <View style={styles.buttons}>
        <Button title='No' onPress={onClose} />
        <Button title='Sì, Elimina' onPress={onDelete} />
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default DeleteModal;
