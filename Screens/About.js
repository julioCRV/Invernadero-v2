import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Nosotros = () => {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Acerca de la Aplicación</Text>
        <Text style={styles.description}>
          Green Manager TC es una aplicación diseñada para monitorear y gestionar dispositivos de un invernadero en tiempo real. 
          Con ella, los usuarios pueden supervisar el estado de sus equipos, verificar las condiciones del ambiente y obtener alertas 
          sobre el funcionamiento de los sistemas que controlan el clima, la humedad y la temperatura dentro del invernadero.
        </Text>
        <Text style={styles.description}>
          La aplicación permite a los usuarios optimizar la producción agrícola, asegurando que el entorno dentro del invernadero 
          se mantenga en condiciones ideales para el crecimiento de las plantas. Gracias a sus herramientas intuitivas y sus alertas 
          personalizadas, Green Manager TC facilita la toma de decisiones informadas para mejorar la eficiencia y la sostenibilidad del 
          proceso agrícola.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#25A256',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default Nosotros;
