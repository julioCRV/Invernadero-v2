import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente que muestra un modal de confirmación para cerrar sesión
const LogoutConfirmationModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Icon name="question-circle" size={30} color="orange" />
          <Text style={styles.title}>¿Deseas cerrar sesión?</Text>
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Sí</Text>
            </TouchableOpacity>
          </View>
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
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    // fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'orange',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#25A256',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LogoutConfirmationModal;
