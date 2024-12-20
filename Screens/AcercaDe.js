import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

// Muestra la pantalla "Acerca de" con información sobre la aplicación y su funcionalidad
const AcercaDe = () => {
  return (
    <>
      <View style={styles.topBox}>
        <Text style={styles.topTitle}>Green Manager TC</Text>
      </View>
      <ScrollView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Acerca de la Aplicación</Text>

          {/* Contenedor con bordes alrededor de la descripción */}
          <View style={styles.descriptionContainer}>
            <View style={styles.imageContainer}>
              <View style={styles.imageContainer2}>

                <Image
                  style={styles.image}
                  source={require('../assets/iconoPlanta.png')} // Reemplaza con la ruta correcta a tu imagen local
                  tintColor="#18A44C"
                />
              </View>
            </View>
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
        </View>
      </ScrollView>
    </>
  );
};

// Define los estilos de la pantalla, contenedores, imágenes y texto en la vista "Acerca de"
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EDFDF2',
  },
  container: {
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer2: {
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#DCFCE7',
    borderRadius: 50
  },
  image: {
    width: 40,
    height: 40,
    marginTop: 18
  },
  topBox: {
    width: '100%',
    height: '10%',
    backgroundColor: '#25A25A',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  topTitle: {
    fontSize: 28,
    fontWeight: 500,
    width: '70%',
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#12682F',
    marginBottom: 10,
    marginLeft: 10
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  descriptionContainer: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#25A256', // Color del borde
    borderRadius: 8, // Esquinas redondeadas
    padding: 20,
    margin: 10,
    marginBottom: 20, // Espacio debajo del contenedor
  },
});

export default AcercaDe;
