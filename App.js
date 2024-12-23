import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, View, Text, TextInput, Pressable, StatusBar, Image } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import IconPlanta from './assets/iconPlanta.png';
// Rutas de navegación de las vistas
import InicioInvernadero from './Screens/InicioInvernadero';
import IniciarSesion from './Screens/IniciarSesion';
import MonitorearControladores from './Screens/MonitorearControladores';
import Dashboard from './Screens/Dashboard';
import AcercaDe from './Screens/AcercaDe';

import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import LoadingModal from './components/ModalLogin';
import SuccessModal from './components/ModalExito';
import ErrorModal from './components/ModalError';
import LogoutConfirmationModal from './components/ModalCerrarSesion';

// Crea navegadores para las rutas en pestañas y en pila
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configura las rutas principales con datos del cliente y vistas específicas
const MainStack = ({ route }) => {
  const { dataCliente } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InicioInvernadero">
        {(props) => <InicioInvernadero {...props} dataCliente={dataCliente} />}
      </Stack.Screen>
      <Stack.Screen name="Monitorear" component={MonitorearControladores} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

// Configura las pestañas principales con estilos personalizados e íconos
const MyTabs = ({ handleLogout, dataCliente }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
          backgroundColor: '#19A44E',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarShowLabel: false,

      }}
    >
      <Tab.Screen
        name="Invernaderos"
        component={MainStack}
        initialParams={{ dataCliente }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={IconPlanta}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? 'white' : '#000',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="AcercaDe"
        component={AcercaDe}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cerrar Sesión"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={handleLogout}>
              <FontAwesome name="user-circle-o" size={20} color={props.color} />
            </TouchableOpacity>
          ),
        }}
      >
        {() => null}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Muestra una vista inicial con imagen de fondo y transiciona tras 3 segundos
const VistaInicio = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require('./assets/fondoInicial.png')}
      style={styles.containerInicial}
      resizeMode="cover"
    />
  );
};

// Comonente principal de renderizado de las rutas
export default function App() {
  // Define los estados para autenticación, vista de introducción y datos del cliente
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [dataCliente, setDataCliente] = useState([]);

  // Define los estados para manejar las credenciales de usuario, el estado de carga, el éxito o error de login, y los mensajes de error.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Maneja el cierre de sesión y la finalización de la vista de introducción
  const handleLogout = () => setModalVisible(true);
  const handleIntroFinish = () => setShowIntro(false);

  const cancelLogout = () => {
    setModalVisible(false);
  };

  const confirmLogout = () => {
    setUsername(''); setPassword(''); setVisible(true);
    setIsAuthenticated(false);
    setModalVisible(false);
  };

  useEffect(() => {
    // Forzamos una actualización de la pantalla de navegación al cambiar el estado
  }, [dataCliente, isAuthenticated]);

  // Realiza el intento de login, manejando el estado de carga, errores y éxito con un tiempo de espera y abortando la solicitud si excede 10 segundos.
  const logueo = async () => {
    try {
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('https://gmb-tci.onrender.com/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username, password: password }),
        // body: JSON.stringify({ user_name: 'romulotoco', password: 'fantasma' }),
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
        }, 2000);

        throw new Error('Login failed');
      }
      const data = await res.json();
      setIsLoading(false);
      setIsLoginSuccess(true);
      setDataCliente(data);

      // Cerrar el modal de éxito y llamar a la función onLogin después de 2 segundo
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoginSuccess(false);
      }, 1000);

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
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Pantalla inicial */}
          {showIntro && (
            <Stack.Screen name="VistaInicio">
              {(props) => <VistaInicio {...props} onFinish={handleIntroFinish} />}
            </Stack.Screen>
          )}
          {/* Autenticación */}
          {!isAuthenticated && !showIntro && (
            <Stack.Screen name="IniciarSesion">

              {(props) => (
                <View style={styles.container}>
                  <StatusBar backgroundColor={color.primary} />
                  <View style={styles.box}>
                    <Image
                      source={require('./assets/imagenLogin2.png')}
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
              )}
            </Stack.Screen>
          )}
          {/* Navegación principal */}
          {isAuthenticated && (
            <Stack.Screen name="Main">
              {(props) => <MyTabs {...props} handleLogout={handleLogout} dataCliente={dataCliente} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <LogoutConfirmationModal
        visible={modalVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

// Define los estilos de la pantalla, contenedores, imágenes y texto en la vista "Iniciar sesións"
const color = {
  primary: '#A1B4AA',
  font: '#25A256',

}
const styles = StyleSheet.create({
  containerInicial: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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