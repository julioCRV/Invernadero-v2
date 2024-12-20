import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente que muestra un modal de exito de guardado con un mensaje y un ícono
const SaveSuccessModal = ({ visible, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Icon name="check-circle" size={20} color="green" />
                    <Text style={styles.successMessage}>Datos guardados correctamente</Text>
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
        width: 300,
        height: 85,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    successMessage: {
        marginTop: 10,
        color: 'green',
    },
});

export default SaveSuccessModal;
