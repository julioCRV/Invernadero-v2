import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Image } from "react-native"
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
        <View
            style={[style.mainContainer, { width: '100%', height: '100%' }]}>
            {/**Contenedor de Imagen */}
            <View style={[style.imageContainer, { height: 250, width: '100%' }]}>
                <Image
                    source={require('../assets/fondo.jpg')}
                    style={{height: 300 }} 
                />
            </View>

            {/**Titulo */}
            <Text style={[style.title, {paddingTop: 30}]}>Bienvenido a </Text>
            <Text style={style.title}>Green Manager TC</Text>
            {/**Space */}
            <View style={{ height: 20 }} />
            {/**Inputs LogIn */}
            <View style={[style.boxContainer, { width: '100%', height: 200 }]}>
                <View style={{ flexDirection: 'row', width: '100%', }}>
                    <MaterialIcons name="person" size={30} color="black" />
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
                    <MaterialIcons name="lock" size={30} color="black" />
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
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={22}
                            color="gray"
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
    )
}

const style = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#dddddd',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 35,
    },
    imageContainer: {
        padding: 5,
        backgroundColor: '#000',
        borderWidth: 1,
        borderRadius: 15,
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
        borderWidth: 1,
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 2,
        shadowColor: 'black',
        elevation: 1,
    },
    textButton: {
        fontSize: 18,
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