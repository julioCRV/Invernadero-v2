import { View, Text, TextInput, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import LoadingModal from '../components/ModalLogin';
import SuccessModal from '../components/ModalExito';
import ErrorModal from '../components/ModalError';

const IniciarSesion = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [isLoginError, setIsLoginError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const logueo = async () => {
        try {
            setIsLoading(true);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 5 segundos

            const res = await fetch('https://gmb-tci.onrender.com/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ user_name: "romulotoco", password: "fantasma" }),
                body: JSON.stringify({ user_name: username, password: password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId); // Limpiar timeout si la solicitud se completa antes

            if (!res.ok) {
                setIsLoading(false); // Detener el modal de carga
                setErrorMessage('Error: Usuario o contraseña incorrectos');
                setIsLoginError(true);

                // Cerrar el modal de error después de 3 segundos
                setTimeout(() => {
                    setIsLoginError(false);
                }, 3000); // Cerrar el modal de éxito y llamar a la función onLogin después de 2 segundo

                throw new Error('Login failed');
            }
            const data = await res.json();
            // alert(`ingresandoo exitosoooooooo: ${data.user_code}`);
            setIsLoading(false); // Detener el modal de carga inmediatamente después de la respuesta
            setIsLoginSuccess(true); // Mostrar el modal de éxito

            // Cerrar el modal de éxito y llamar a la función onLogin después de 2 segundo
            setTimeout(() => {
                setIsLoginSuccess(false);  // Cerrar el modal de éxito
                onLogin(data); // Llamar a la función onLogin (si la tienes)
            }, 2000);
        } catch (err) {
            setIsLoading(false);
            if (err.include(Login_failed)) {
                setErrorMessage('Error: Usuario o contraseña incorrectos');
            } else {
                setErrorMessage(` ${err}`);
            }

            console.error(err);
            // alert(`Error en la solicitud: ${err}`);
        }
    };

    const logueo2 = async () => {
        try {
            setIsLoading(true); // Inicia el modal de carga

            const res = await fetch('https://gmb-tci.onrender.com/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: "romulotoco", password: "fantasma" }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Login successful', data);
                // alert(`Login existosooooooooooo ${data.user_code}`); 
                // Aquí, en vez de usar setTimeout, gestionamos el cierre del modal sin demoras innecesarias
                setIsLoading(false); // Detener el modal de carga inmediatamente después de la respuesta
                setIsLoginSuccess(true); // Mostrar el modal de éxito

                // Cerrar el modal de éxito y llamar a la función onLogin después de 1 segundo
                setTimeout(() => {
                    setIsLoginSuccess(false);  // Cerrar el modal de éxito
                    onLogin(data); // Llamar a la función onLogin (si la tienes)
                }, 3000);

            } else {
                // Manejo de error
                setIsLoading(false); // Detener el modal de carga
                setErrorMessage('Error: Usuario o contraseña incorrectos');
                setIsLoginError(true);

                // Cerrar el modal de error después de 3 segundos
                setTimeout(() => {
                    setIsLoginError(false);
                }, 3000);
                console.error('Login failed', data.message);
                alert('Login failed');
            }
        } catch (err) {
            // Manejo de error de conexión
            setIsLoading(false); // Detener el modal de carga
            setLoginMessage('Error de conexión');
            setErrorMessage('Error de conexión');
            setIsLoginError(true);

            // Cerrar el modal después de 3 segundos
            setTimeout(() => {
                setIsLoginError(false);
            }, 1000);
            console.error('Error:', err);
            alert('Error de conexión');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={color.primary} />
            <View style={styles.box}>
                {/*Circle*/}
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

            {/* Modal de carga */}
            <LoadingModal isVisible={isLoading} message="Iniciando sesión..." />
            <SuccessModal visible={isLoginSuccess} onClose={() => setIsLoginSuccess(false)} />
            <ErrorModal visible={isLoginError} errorMessage={errorMessage} onClose={() => setIsLoginError(false)} />
        </View>
    )
}

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