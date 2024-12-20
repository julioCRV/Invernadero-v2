import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

// Componente que muestra un modal de carga con un indicador de actividad y un mensaje personalizado.
const LoadingModal = ({ isVisible, message }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#19A44E" />
          <Text>{message}</Text>
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
    height: 85,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default LoadingModal;
