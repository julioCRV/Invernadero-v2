import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>Dashboard</Text>

        {/* Gráfico de Línea para Temperatura */}
        <Text style={styles.subtitle}>Temperatura (°C)</Text>
        <LineChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ data: data.temperature, color: () => '#ff6347', strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 40} // Ancho del gráfico
          height={220} // Alto del gráfico
          yAxisSuffix="°C"
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 1, // Mostramos 1 decimal
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#ffa726' },
          }}
          bezier // Suavizamos las líneas
          style={{ marginVertical: 20, borderRadius: 16 }}
        />

        {/* Gráfico de Línea para Humedad */}
        <Text style={styles.subtitle}>Humedad (%)</Text>
        <LineChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ data: data.humidity, color: () => '#1e90ff', strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 40} // Ancho del gráfico
          height={220} // Alto del gráfico
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 0, // Mostramos sin decimales
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#1e90ff' },
          }}
          bezier // Suavizamos las líneas
          style={{ marginVertical: 20, borderRadius: 16 }}
        />

        {/* Tabla de Registro de Estado de Sensores */}
        <Text style={styles.subtitle}>Registro de Estado de Sensores</Text>
        <FlatList
          data={sensorStatus}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.date}</Text>
              <Text style={styles.tableCell}>{item.time}</Text>
              <Text style={styles.tableCell}>{item.device}</Text>
              <Text style={styles.tableCell}>{item.status}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Fecha</Text>
              <Text style={styles.tableCell}>Hora</Text>
              <Text style={styles.tableCell}>Dispositivo</Text>
              <Text style={styles.tableCell}>Estado</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginVertical: 10,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    backgroundColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Dashboard;
