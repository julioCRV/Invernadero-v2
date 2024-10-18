
import { StyleSheet, ImageBackground } from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import InicioInvernadero from './Screens/InicioInvernadero';
import IniciarSesion from './Screens/IniciarSesion';
import MonitorearControladores from './Screens/MonitorearControladores';
import Dashboard from './Screens/Dashboard'
import { Ionicons } from '@expo/vector-icons';

const VistaInicio = ({ navigation }) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('IniciarSesion');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require('./assets/fondoInicial.png')}
      style={styles.container}
      resizeMode="cover"
    >
    </ImageBackground>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <InicioInvernadero navigation={navigation} />
  );
};

export default function App() {

  const Stack = createStackNavigator();

  function MyStack() {

    return (
      <Stack.Navigator initialRouteName="VistaInicio">
        <Stack.Screen name="VistaInicio" component={VistaInicio} options={{ headerShown: false }} />

        <Stack.Screen name='IniciarSesion' component={IniciarSesion}
          options={{
            title: "",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#FCB03E" },
          }} />
        <Stack.Screen name='Lista' component={HomeScreen}
          options={({ navigation }) => ({
            title: "Green Manager TC",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#FCB03E" },
            headerRight: () => (
              <Ionicons
                name="log-out"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('IniciarSesion')}
              />
            ),
            headerLeft: () => null,
          })} />
        <Stack.Screen name="Monitorear" component={MonitorearControladores}
          options={({ navigation }) => ({
            title: "Nombre del invernadero",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#FCB03E" },
            headerRight: () => (
              <Ionicons
                name="log-out"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('IniciarSesion')}
              />
            ),
          })} />
        <Stack.Screen name="Dashboard" component={Dashboard}
          options={({ navigation }) => ({
            title: "Dashboard",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#FCB03E" },
            headerRight: () => (
              <Ionicons
                name="log-out"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('IniciarSesion')}
              />
            ),
          })} />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
