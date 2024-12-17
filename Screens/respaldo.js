// Iniciar.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LoadingModal from './components/ModalLogin'; // Importa el componente de Modal

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulamos un proceso de login con setTimeout
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true); // Marcar como exitoso el login
      // Desaparece el mensaje después de 3 segundos
      setTimeout(() => {
        setLoginSuccess(false); // Ocultar el mensaje de éxito
      }, 2000);
    }, 3000); // Simula un login que tarda 3 segundos
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Button title="Iniciar sesión" onPress={handleLogin} />
      
      {/* Usamos el componente Modal */}
      <LoadingModal isVisible={isLoading} message="Iniciando sesión..." />

      {/* Aquí puedes mostrar un mensaje de éxito o cualquier otra cosa */}
      {loginSuccess && (
        <Text style={styles.successText}>¡Login exitoso!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
