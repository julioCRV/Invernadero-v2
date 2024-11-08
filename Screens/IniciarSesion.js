import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, ImageBackground, View, Image } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from "react";

export default function LogIn(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const logueo = async () => {
        try {
            const res = await fetch('https://gmb-tci.onrender.com/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: username, password: password })
            });

            const data = await res.json();
            if (res.ok) {
                console.log('Login successful', data);
                props.navigation.navigate('Lista');  // Navegar a la pantalla 'Lista'
            } else {
                console.error('Login failed', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };


    return (
        <ImageBackground
            source={require('../assets/fondo1.png')}
            style={style.container}
            resizeMode="cover"
        >
            <View
                style={[style.mainContainer]}>
                {/**Contenedor de Imagen */}
                <View style={[style.imageContainer]}>
                    <Image
                        source={require('../assets/imagenLogin.jpg')}
                        style={{ height: 250, width: 300, borderRadius: 30 }}
                    />
                </View>

                {/**Titulo */}
                <Text style={[style.title, { paddingTop: 30 }]}>Bienvenido a </Text>
                <Text style={style.title}>Green Manager TC</Text>
                {/**Space */}
                <View style={{ height: 20 }} />
                {/**Inputs LogIn */}
                <View style={[style.boxContainer, { width: '100%', height: 200 }]}>
                    <View style={{ flexDirection: 'row', width: '100%', }}>
                        <MaterialIcons name="person" size={30} color="#50BE5B" />
                        <TextInput
                            style={style.inputUsername}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Nombre de Usuario"
                            keyboardType="default" // Tipo de teclado para texto
                            autoCapitalize="none" // Desactiva capitalización automática
                        />
                    </View>

                    {/**Space */}
                    <View style={{ height: 10 }} />

                    <View style={{ flexDirection: 'row', width: '100%', }}>
                        <MaterialIcons name="lock" size={30} color="#50BE5B" />
                        <TextInput
                            style={style.inputUsername}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry={!showPassword} // Desactiva capitalización automática
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={style.icon}
                            activeOpacity={0.8}
                        >
                            <FontAwesome5
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={22}
                                color="#50BE5B"
                            />
                        </TouchableOpacity>
                    </View>
                    {/**Space */}
                    <View style={{ height: 20 }} />
                    <Pressable style={style.button} onPress={logueo}>
                        <Text style={style.textButton}>Iniciar Sesion</Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        paddingTop: '18%',
        height: '120%'
    },

    mainContainer: {
        // backgroundColor: '#dddddd',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 35,
    },
    imageContainer: {
        padding: 5,
        // backgroundColor: '#000',
        // borderWidth: 1,
        borderRadius: 25,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: "400",
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#59cf62',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        color: 'white',
        fontSize: 18
    },
    boxContainer: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'black',
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 30
    },
    inputUsername: {
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        flex: 1,
        borderRadius: 5
    },
    icon: {
        padding: 5,
        position: 'absolute',
        right: 0
    },
    text: {
        fontSize: 15,
        color: 'black',
        fontWeight: "500",
    },
    text2: {
        fontSize: 15,
        color: 'white',
        fontWeight: "200",
    },
})