import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente que muestra un modal de confirmación para guardar cambios
const SaveChangesModal = ({ visible, onSave, onCancel }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Icon name="save" size={30} color="orange" />
                    <Text style={styles.title}>¿Deseas guardar los cambios?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                            <Text style={styles.buttonText}>Guardar</Text>
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
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
        marginRight: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SaveChangesModal;
