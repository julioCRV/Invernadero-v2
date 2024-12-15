import { View, Text, TextInput, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';

export default function LogIn({props, onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');

    const logueo = async () => {
        console.log('Username:', username);
        console.log('Password:', password);
        try {
            const res = await fetch('https://gmb-tci.onrender.com/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ user_name: username, password: password })
                body: JSON.stringify({ user_name: "romulotoco", password: "fantasma" })
            });

            const data = await res.json();
            if (res.ok) {
                console.log('Login successful', data);
                onLogin();
                // props.navigation.navigate('Inicio Invernadero');
            } else {
                console.error('Login failed', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
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