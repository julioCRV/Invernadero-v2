import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente que muestra un modal de error con un mensaje y un ícono
const ErrorModal = ({ visible, errorMessage, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Icon name="times-circle" size={20} color="red" />
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

// Estilos del modal y sus elementos
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    height: 95,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: 'red',
  },
});

export default ErrorModal;
