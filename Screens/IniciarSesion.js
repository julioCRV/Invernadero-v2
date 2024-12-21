import { View, Text, TextInput, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import React, { useState, useRef } from 'react';
import LoadingModal from '../components/ModalLogin';
import SuccessModal from '../components/ModalExito';
import ErrorModal from '../components/ModalError';

// Componente para manejar el proceso y diseño del inicio de sesión.
const IniciarSesion = ({ onLogin }) => {
    // Define los estados para manejar las credenciales de usuario, el estado de carga, el éxito o error de login, y los mensajes de error.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [isLoginError, setIsLoginError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Realiza el intento de login, manejando el estado de carga, errores y éxito con un tiempo de espera y abortando la solicitud si excede 10 segundos.
    const logueo = async () => {
        try {
            setIsLoading(true);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch('https://gmb-tci.onrender.com/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ user_name: username, password: password }),
                body: JSON.stringify({ user_name: 'romulotoco', password: 'fantasma' }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                setIsLoading(false);
                setErrorMessage('Error: Usuario o contraseña incorrectos');
                setIsLoginError(true);

                // Cerrar el modal de error después de 3 segundos
                setTimeout(() => {
                    setIsLoginError(false);
                }, 3000);

                throw new Error('Login failed');
            }
            const data = await res.json();
            setIsLoading(false);
            setIsLoginSuccess(true);

            // Cerrar el modal de éxito y llamar a la función onLogin después de 2 segundo
            setTimeout(() => {
                setIsLoginSuccess(false);
                onLogin(data);
            }, 2000);
        } catch (err) {
            setIsLoading(false);
            if (err.include(Login_failed)) {
                setErrorMessage('Error: Usuario o contraseña incorrectos');
            } else {
                setErrorMessage(` ${err}`);
            }
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={color.primary} />
            <View style={styles.box}>
                <Image
                    source={require('../assets/imagenLogin2.png')}
                    style={styles.containerImage}
                />
                <Text style={styles.title}>Bienvenido a Green Manager TC</Text>

                <View style={styles.inputContainer}>
                    <Octicons name="person" size={24} color="black" />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        placeholderTextColor={color.font}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Feather name="unlock" size={24} color="black" />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor={color.font}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={visible}
                    />
                    <Pressable style={styles.iconEye} onPress={() => setVisible(!visible)}>
                        {
                            visible ? (<Feather name="eye-off" size={24} color="black" />) : (<Feather name="eye" size={24} color="black" />)
                        }
                    </Pressable>
                </View>

                <Pressable title="Login" onPress={logueo} style={styles.button}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </Pressable>
            </View>

            {/* Modales de estado */}
            <LoadingModal isVisible={isLoading} message="Iniciando sesión..." />
            <SuccessModal visible={isLoginSuccess} onClose={() => setIsLoginSuccess(false)} />
            <ErrorModal visible={isLoginError} errorMessage={errorMessage} onClose={() => setIsLoginError(false)} />
        </View>
    )
}

// Define los estilos de la pantalla, contenedores, imágenes y texto en la vista "Iniciar sesións"
const color = {
    primary: '#A1B4AA',
    font: '#25A256',

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 90,
        backgroundColor: '#AACCB2',
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
        color: color.font
    },
    input: {
        height: 40,
        width: '75%',
        paddingLeft: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: color.primary,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        width: '100%'
    },
    iconEye: {
        position: 'absolute',
        right: 15
    },
    button: {
        marginTop: 50,
        backgroundColor: color.font,
        marginHorizontal: 30,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        width: '80%',
        alignItems: 'center',
        color: 'white',
        borderColor: 'black', borderWidth: 1
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '300'
    },
    containerImage: {
        width: 120,
        height: 120,
        backgroundColor: 'black',
        borderRadius: 100,
        marginBottom: 10
    }

});

export default IniciarSesion;