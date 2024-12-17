
import { StyleSheet, ImageBackground, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import InicioInvernadero from './Screens/InicioInvernadero';
import IniciarSesion from './Screens/IniciarSesion';
import MonitorearControladores from './Screens/MonitorearControladores';
import Dashboard from './Screens/Dashboard';
import Nosotros from './Screens/About';

import IconPlanta from './assets/iconPlanta.png';


// Crear el Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Monitorear y Dashboard
const MainStack = ({ route }) => {
  const { dataCliente } = route.params; // Aquí accedes a dataCliente a través de params

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="InicioInvernadero" 
        component={(props) => <InicioInvernadero {...props} dataCliente={dataCliente} />}  // Pasamos dataCliente como prop
      />
      <Stack.Screen name="Monitorear" component={MonitorearControladores} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};


const MyTabs = ({ handleLogout, dataCliente }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
          backgroundColor: '#19A44E', // Fondo de la barra de navegación
        },
        tabBarActiveTintColor: 'white', // Color de los iconos activos
        tabBarInactiveTintColor: 'black', // Color de los iconos inactivos
        headerShown: false, // Oculta los encabezados individuales
        tabBarShowLabel: false,

      }}
    >
      <Tab.Screen
        name="Invernaderos"
        component={MainStack}
        initialParams={{ dataCliente }} // Pasamos dataCliente a MainStack
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={IconPlanta} // Usa la imagen
              style={{
                width: 24, // Ajusta el tamaño
                height: 24,
                tintColor: focused ? 'white' : '#000', // Cambia el color según el estado
              }}
              resizeMode="contain" // Mantiene las proporciones
            />
          ),
        }}
      />
      <Tab.Screen
        name="Nosotros"
        component={Nosotros}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cerrar Sesión"
        component={() => null} // No muestra un componente
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={handleLogout} // Cierra la sesión
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};



const VistaInicio = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish(); // Llama a la función cuando se debe terminar la vista inicial
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

// App principal con navegación
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [dataCliente, setDataCliente] = useState([]);

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setDataCliente(data);
  }

  const handleLogout = () => setIsAuthenticated(false);
  const handleIntroFinish = () => setShowIntro(false);

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
            {(props) => <MyTabs {...props} handleLogout={handleLogout} dataCliente={dataCliente}/>}
          </Stack.Screen>
        )}
      </Stack.Navigator>

    </NavigationContainer>
  );
}

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