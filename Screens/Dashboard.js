import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView, ImageBackground } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const Dashboard = () => {
  // Simulamos los datos de temperatura y humedad de una semana (7 días)
  const [data, setData] = useState({
    temperature: [22, 24, 28, 29, 27, 30, 26],  // Simula datos de temperatura
    humidity: [60, 65, 55, 70, 75, 68, 72],    // Simula datos de humedad
  });

  // Simulamos registros de estado de los sensores
  const [sensorStatus, setSensorStatus] = useState([
    { id: '1', date: '2024-10-17', time: '09:00', device: 'Bomba de Agua', status: 'Encendido' },
    { id: '2', date: '2024-10-17', time: '11:30', device: 'Calefacción', status: 'Apagado' },
    { id: '3', date: '2024-10-17', time: '13:15', device: 'Sistema Contra Incendios', status: 'Encendido' },
    { id: '4', date: '2024-10-17', time: '15:00', device: 'Humidificación', status: 'Apagado' },
    { id: '5', date: '2024-10-17', time: '17:45', device: 'Ventilación', status: 'Encendido' },
  ]);


  return (
    <ImageBackground
  source={require('../assets/fondo1.png')}
  style={styles.container}
  resizeMode="cover">
  <FlatList
    data={sensorStatus}
    keyExtractor={(item) => item.id}
    showsVerticalScrollIndicator={false}
    ListHeaderComponent={() => (
      <View>
        {/* Título */}
        <Text style={styles.title}>Dashboard</Text>

        {/* Gráfico de Línea para Temperatura */}
        <Text style={styles.subtitle}>TEMPERATURA</Text>
        <LineChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ data: data.temperature, color: () => '#ff6347', strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix="°C"
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#ffa726' },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 16 }}
        />

        {/* Gráfico de Línea para Humedad */}
        <Text style={styles.subtitle}>HUMEDAD</Text>
        <LineChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ data: data.humidity, color: () => '#1e90ff', strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#1e90ff' },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 16 }}
        />

        {/* Título para tabla */}
        <Text style={styles.subtitleTabla}>REGISTRO DE ESTADOS DE SENSORES</Text>
      </View>
    )}
    renderItem={({ item }) => (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>{item.date}</Text>
        <Text style={styles.tableCell}>{item.time}</Text>
        <Text style={styles.tableCell}>{item.device}</Text>
        <Text style={styles.tableCell}>{item.status}</Text>
      </View>
    )}
    ListHeaderComponentStyle={{ marginBottom: 20 }}
    ListFooterComponent={() => <View style={{ height: 20 }} />}
  />
</ImageBackground>

  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: '18%',
    height: '120%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#666',
    marginVertical: 10,
    textAlign: 'left',
  },
  subtitleTabla: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    backgroundColor: '#FFFF85'
  },
  tableHeader: {
    backgroundColor: '#FED351',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Dashboard;
