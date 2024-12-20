import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
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
      style={styles.container}
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

  // Maneja el inicio de sesión, actualizando el estado de autenticación y los datos del cliente
  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setDataCliente(data);
  }

  // Maneja el cierre de sesión y la finalización de la vista de introducción
  const handleLogout = () => setIsAuthenticated(false);
  const handleIntroFinish = () => setShowIntro(false);

  useEffect(() => {
    // Forzamos una actualización de la pantalla de navegación al cambiar el estado
  }, [dataCliente, isAuthenticated]); 


  return (
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
            {(props) => <IniciarSesion {...props} onLogin={handleLogin} />}
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
  );
}

//Estilos del componente
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});