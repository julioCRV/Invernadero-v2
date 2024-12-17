import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView, ImageBackground, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRoute } from '@react-navigation/native';
import { calefaccion, humidificador, valvula, ventilacion } from "../assets/estadosDashboard/estadoDashboard";

const Dashboard = () => {
  const scrollViewRef = useRef(null); // Creamos un ref para el ScrollView
  const route = useRoute();
  const { item } = route.params;
  // Simulamos los datos de temperatura y humedad de una semana (7 días)
  const [data, setData] = useState({
    temperature: [22, 24, 28, 29, 27, 30, 26],  // Simula datos de temperatura
    humidity: [60, 65, 55, 70, 75, 68, 72],    // Simula datos de humedad
  });

  const [dataTabla, setDataTabla] = useState(null);
  const [dataGrafica, setDataGrafica] = useState(null);
  const [historicalData, setHistoricalData] = useState([]); // Estado para acumular datos históricos
  const historicalData2 = [
    { temperature: 30, humidity: 20, receivedAt: "20:41:34" },
    { temperature: 28, humidity: 22, receivedAt: "20:42:34" },
    { temperature: 27, humidity: 24, receivedAt: "20:43:34" },
    { temperature: 29, humidity: 21, receivedAt: "20:44:34" },
    { temperature: 31, humidity: 19, receivedAt: "20:45:34" },
    { temperature: 32, humidity: 18, receivedAt: "20:46:34" },
    { temperature: 30, humidity: 20, receivedAt: "20:47:34" }, { temperature: 27, humidity: 24, receivedAt: "20:43:34" },
    { temperature: 29, humidity: 21, receivedAt: "20:44:34" },
    { temperature: 31, humidity: 19, receivedAt: "20:45:34" },
    { temperature: 32, humidity: 18, receivedAt: "20:46:34" },
    { temperature: 30, humidity: 20, receivedAt: "20:47:34" }, { temperature: 27, humidity: 24, receivedAt: "20:43:34" },
    { temperature: 29, humidity: 21, receivedAt: "20:44:34" },
    { temperature: 31, humidity: 19, receivedAt: "20:45:34" },
    { temperature: 32, humidity: 18, receivedAt: "20:46:34" },
    { temperature: 30, humidity: 20, receivedAt: "20:47:34" }, { temperature: 27, humidity: 24, receivedAt: "20:43:34" },
    { temperature: 29, humidity: 21, receivedAt: "20:44:34" },
    { temperature: 31, humidity: 19, receivedAt: "20:45:34" },
    { temperature: 32, humidity: 18, receivedAt: "20:46:34" },
    { temperature: 30, humidity: 20, receivedAt: "20:47:34" }, { temperature: 27, humidity: 24, receivedAt: "20:43:34" },
    { temperature: 29, humidity: 21, receivedAt: "20:44:34" },
    { temperature: 31, humidity: 19, receivedAt: "20:45:34" },
    { temperature: 32, humidity: 18, receivedAt: "20:46:34" },
    { temperature: 30, humidity: 20, receivedAt: "20:47:34" }
  ];
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);

  const fetchControllerInfo = async () => {
    try {
      const response = await fetch('https://gmb-tci.onrender.com/controller/get_registers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          controller_code: item.cod_controller
        })
      });

      const data = await response.json();

      if (response.ok) {
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.hour}`);
          const dateB = new Date(`${b.date}T${b.hour}`);
          return dateB - dateA; // Ordena de más reciente a menos reciente
        });
        const dataWithKeys = sortedData.map((item, index) => ({
          ...item,
          id: index + 1 // Agrega un identificador basado en el índice (comenzando desde 1)
        }));
        setDataTabla(dataWithKeys);
      } else {
        console.error('Error en la respuesta:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const fetchDataGrafico = async () => {
    try {
      const response = await fetch('https://gmb-tci.onrender.com/controller/get_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          controller_code: item.cod_controller,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Obtiene la hora actual
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Agrega la hora a los datos
        const dataWithTime = { ...data, receivedAt: formattedTime };

        // Compara si la temperatura o la humedad han cambiado
        if (
          !dataGrafica || // Si es la primera llamada
          data.temperature !== dataGrafica.temperature || // Cambios en temperatura
          data.humidity !== dataGrafica.humidity // Cambios en humedad
        ) {
          // Actualiza el estado de la última respuesta
          console.log(dataWithTime);
          setDataGrafica(dataWithTime);

          // Agrega los datos con hora al historial
          setHistoricalData((prevHistoricalData) => [...prevHistoricalData, dataWithTime]);
        }
      } else {
        console.error('Error en la respuesta:', data.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  useEffect(() => {
    fetchControllerInfo();
    fetchDataGrafico();
  }, []);

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case "calefactor":
        return calefaccion;
      case "humedificador":
        return humidificador;
      case "valvula":
        return valvula;
      case "ventilacion":
        return ventilacion;
      default:
        return null; // Si no coincide, no muestra un ícono
    }
  };

  const getNombre = (device) => {
    switch (device.toLowerCase()) {
      case "calefactor":
        return "Calefacción";
      case "humedificador":
        return "Humidificador";
      case "valvula":
        return "Válvula de agua";
      case "ventilacion":
        return "Ventilación";
      default:
        return null; // Si no coincide, no muestra un ícono
    }
  };

  // Se ejecuta cada 5 segundos para actualizar el gráfico
  useEffect(() => {
    const interval = setInterval(fetchDataGrafico, 4000);
    return () => clearInterval(interval);
  }, [dataGrafica]);

  // Procesa los datos históricos para el gráfico 
  const processedData = historicalData.map((entry) => entry.temperature); // Extrae las temperaturas
  const processedDataH = historicalData.map((entry) => entry.humidity); // Extrae las temperaturas
  const labels = historicalData.map((entry) => entry.receivedAt); // Extrae las horas

  return (
    <ImageBackground
      backgroundColor="#EDFDF2"
      style={styles.container}
      resizeMode="cover"
    >
      <FlatList
        data={dataTabla}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* Título */}
            <Text style={styles.title}>Dashboard</Text>


            {/* Gráfico de Línea para Temperatura */}
            <View style={{ backgroundColor: '#FFF' }}>
              <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                <Image
                  source={require('../assets/temperatura.png')}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
                <Text style={styles.subtitle}>Temperatura</Text>
              </View>
              {selectedValue !== null && (
                <Text style={{ textAlign: 'center', paddingTop: 10 }}>
                  Valor de temperatura seleccionado: {selectedValue}°C
                </Text>
              )}
              {historicalData.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollViewRef}>
                  <LineChart
                    data={{
                      labels: labels.length > 0 ? labels : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                      datasets: [
                        {
                          data: processedData,
                          color: () => '#419D80',
                          strokeWidth: 2,
                        },
                      ],
                    }}
                    width={Math.max(Dimensions.get('window').width - 40, labels.length * 50)} // Ajusta el ancho según el número de etiquetas
                    height={220}
                    yAxisSuffix="°C"
                    chartConfig={{
                      backgroundColor: '#FFF',
                      backgroundGradientFrom: '#FFF',
                      backgroundGradientTo: '#FFF',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: { r: '4', strokeWidth: '2', stroke: '#1e90ff' },
                    }}
                    bezier
                    style={{ marginVertical: 20, borderRadius: 16 }}
                    onDataPointClick={(data) => {
                      const { value } = data;
                      setSelectedValue(value);
                    }}
                  />
                </ScrollView>

              ) : (
                <Text></Text>
              )}
            </View>

            {/* Gráfico de Línea para Humedad */}
            <View style={{ backgroundColor: '#FFF', marginTop: 12 }}>
              <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                <Image
                  source={require('../assets/humedad.png')}
                  style={{ width: 15, height: 18, marginLeft: 5 }}
                />
                <Text style={styles.subtitle}> Humedad</Text>
              </View>
              {selectedValue2 !== null && (
                <Text style={{ paddingTop: 10, textAlign: 'center' }}>
                  Valor de humedad seleccionado: {selectedValue2} %
                </Text>
              )}
              {historicalData.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <LineChart
                    data={{
                      labels: labels.length > 0 ? labels : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                      datasets: [
                        {
                          data: processedDataH,
                          color: () => '#749FE2', strokeWidth: 2
                        }],

                    }}
                    width={Math.max(Dimensions.get('window').width - 40, labels.length * 50)}
                    height={220}
                    yAxisSuffix="%"
                    chartConfig={{
                      backgroundColor: '#FFF',
                      backgroundGradientFrom: '#FFF',
                      backgroundGradientTo: '#FFF',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: { r: '4', strokeWidth: '2', stroke: '#1e90ff' },
                    }}
                    bezier
                    style={{ marginVertical: 20, borderRadius: 16 }}
                    onDataPointClick={(data) => {
                      const { value } = data;
                      setSelectedValue2(value);
                    }}
                  />
                </ScrollView>
              ) : (
                <Text></Text>
              )}
            </View>

            {/* Título para tabla */}
            <View style={styles.tableCabeza}>
              <Text style={[styles.subtitle, { paddingLeft: 28 }]}>Registro de Estado de Dispositivos</Text>
            </View>

            {/* Encabezado de la tabla */}
            <View style={[styles.tableRow, { backgroundColor: '#F0F0F0', paddingVertical: 10 }]}>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Fecha</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Hora</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Dispositivo</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Estado</Text>
            </View>
          </View>

        )
        }
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.hour}</Text>
            <View style={styles.deviceCell}>
              {/* Ícono del dispositivo */}
              <Image
                source={getDeviceIcon(item.device)} // Obtiene el ícono según el dispositivo
                style={styles.icon} // Estilo para el ícono
              />
              {/* Nombre del dispositivo */}
              <Text style={styles.deviceText}>{getNombre(item.device)}</Text>
            </View>
            <Text
              style={[
                styles.tableCell,
                item.state ? styles.stateOn : styles.stateOff, // Estilos dinámicos
              ]}
            >
              {item.state ? "Encendido" : "Apagado"}
            </Text>
          </View>
        )}
        ListHeaderComponentStyle={{ marginBottom: 0 }} // Elimina el espacio entre el encabezado y la tabla
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
    </ImageBackground >


  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: '7%',
    height: '120%'
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableCabeza: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center', // Centra el texto verticalmente
    marginBottom: 0, // Asegura que no haya separación con los datos
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#12682F',
    textAlign: 'center',
    paddingBottom: 20
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12682F',
    marginBottom: 2
  },
  icon: {
    width: 12,
    height: 12,
  },
  deviceCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  deviceText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#000",
  },
  tableHeader: {
    backgroundColor: '#FED351',
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "left",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: '#FFF'
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
  },

  stateOn: {
    color: "#357951",
    backgroundColor: "#BDF7CF",
    borderRadius: 10,
    fontWeight: 'bold',
    textAlign: "center",
    marginLeft: 15
  },
  stateOff: {
    color: "#A02C22",
    backgroundColor: "#FDC9CE",
    borderRadius: 10,
    fontWeight: 'bold',
    textAlign: "center",
    marginLeft: 15
  },

});

export default Dashboard;
