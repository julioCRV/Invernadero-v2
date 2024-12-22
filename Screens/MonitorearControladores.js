import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Switch, Image, Dimensions, TouchableOpacity, ImageBackground, Pressable, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native';
import { calefaccion, humidificador, valvula, ventilacion, enchufe, temperatura, humedad } from "../assets/estados/estados";
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente para manejar el proceso y diseño del monitoreo de un controlador en especifico.
const MonitorearControladores = () => {
    // Definición de estados y obtención de parámetros de la ruta para gestionar la información y el estado de carga.
    const route = useRoute();
    const { item } = route.params;
    const [pressedKey, setPressedKey] = useState(null);
    const [data, setData] = useState(null);
    const [dataAutomatica, setDataAutomatica] = useState(null);
    const [loading, setLoading] = useState(false);

    // Función para obtener la información del controlador, traducir los datos y actualizar los estados `data` y `dataAutomatica` con los valores correspondientes.
    const fetchControllerInfo = async () => {
        try {
            const response = await fetch('https://gmb-tci.onrender.com/controller/get_controller_information', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    controller_code: item.cod_controller
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return;
            }

            const dataResponse = await response.json();
            if (dataResponse && typeof dataResponse === 'object') {
                const translatedData = {
                    manual_heating: dataResponse.manual_heating,
                    manual_humedifier: dataResponse.manual_humedifier,
                    manual_valve: dataResponse.manual_valve,
                    manual_ventilation: dataResponse.manual_ventilation,
                    Temperatura: dataResponse.temperature,
                    Humedad: dataResponse.humidity,
                };

                const translatedData2 = {
                    conection_controller: dataResponse.conection_controller,
                    stable_humidity: dataResponse.stable_humidity,
                    stable_temperature: dataResponse.stable_temperature,
                    heating_activated: dataResponse.heating_activated,
                    heating_desactivated: dataResponse.heating_deactivated,
                    humedifier_activated: dataResponse.humedifier_activated,
                    humedifier_desactivated: dataResponse.humedifier_deactivated,
                    valve_activated: dataResponse.valve_activated,
                    valve_desactivated: dataResponse.valve_deactivated,
                    ventilation_activated: dataResponse.ventilation_activated,
                    ventilation_desactivated: dataResponse.ventilation_deactivated,
                };

                setData(translatedData);
                setDataAutomatica(translatedData2);
            } else {
                console.log('Los datos recibidos no tienen el formato esperado.');
            }
        } catch (fetchError) {
            console.error(`Error al realizar la solicitud: ${fetchError.message}`);
        } finally {
            setLoading(false);
        }
    };

    // `useEffect` para ejecutar la función `fetchControllerInfo` cuando el componente se monte, obteniendo la información del controlador.
    useEffect(() => {
        fetchControllerInfo();
    }, []);

    // `useEffect` que llama a `fetchControllerInfo` al cargar el componente y luego la ejecuta cada 10 segundos, limpiando el intervalo al desmontar el componente.
    useEffect(() => {
        fetchControllerInfo();

        const interval = setInterval(() => {
            fetchControllerInfo();
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    // Función que actualiza el estado de un sensor específico enviando una solicitud PUT al servidor y luego recargando la información del controlador.
    const handleChangeState = async (sensorType, newValue) => {
        if (dataAutomatica.conection_controller) {
            const urlMap = {
                manual_heating: 'https://gmb-tci.onrender.com/controller/update_manual_heating',
                manual_humedifier: 'https://gmb-tci.onrender.com/controller/update_manual_humedifier',
                manual_valve: 'https://gmb-tci.onrender.com/controller/update_manual_valve',
                manual_ventilation: 'https://gmb-tci.onrender.com/controller/update_manual_ventilation',
            };

            const bodyMap = {
                manual_heating: 'manual_heating',
                manual_humedifier: 'manual_humedifier',
                manual_valve: 'manual_valve',
                manual_ventilation: 'manual_ventilation',
            };

            const url = urlMap[sensorType];
            const bodyKey = bodyMap[sensorType];

            if (!url || !bodyKey) {
                console.error('Tipo de sensor no válido');
                alert('Tipo de sensor no válido');
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        controller_code: item.cod_controller,
                        [bodyKey]: newValue,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    await fetchControllerInfo();
                    console.log('Datos actualizados');
                } else {
                    console.error('Error en la respuesta:', data.message);
                    alert('Error en la respuesta:', data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert(`Error en la solicitud: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // Función que devuelve la fuente de imagen correspondiente según el tipo de sensor y su estado (activado o desactivado).
    const getImageSource = (key, value) => {
        if (key.toLowerCase().includes("manual humedifier")) {
            return value ? humidificador : humidificador;
        }
        if (key.toLowerCase().includes('manual valve')) {
            return value ? valvula : valvula;
        }
        if (key.toLowerCase().includes('manual ventilation')) {
            return value ? ventilacion : ventilacion;
        }
        if (key.toLowerCase().includes('manual heating')) {
            return value ? calefaccion : calefaccion;
        }
    };

    // Control manual: Función que ajusta el estilo de la imagen según el estado de la conexión y el tipo de sensor, aplicando un color y un tamaño diferente.
    const getImageStyle = (key, value) => {
        if (dataAutomatica.conection_controller === false) {
            const isSpecialKey = ['conection_controller'].includes(key);
            return {
                tintColor: value
                    ? (isSpecialKey ? 'white' : 'white')
                    : (isSpecialKey ? 'red' : 'white'),
                transform: [{ scale: 1.8 }], // Aumenta el tamaño en un 40%
            };
        } else {
            const isSpecialKey = ['conection_controller', 'stable_humidity', 'stable_temperature'].includes(key);
            return {
                tintColor: value
                    ? (isSpecialKey ? 'green' : 'orange')
                    : (isSpecialKey ? 'red' : 'white'),
                transform: [{ scale: 1.8 }], // Aumenta el tamaño en un 40%
            };
        }


    };

    // Control Automatico: Función que retorna la imagen correspondiente según el tipo de clave, relacionada con diferentes sensores o estados del controlador.
    const getImageSource2 = (key) => {
        if (key.toLowerCase().includes('humedifier_activated') || key.toLowerCase().includes('humedifier_desactivated')) {
            return humidificador;
        }
        if (key.toLowerCase().includes('valve_activated') || key.toLowerCase().includes('valve_desactivated')) {
            return valvula;
        }
        if (key.toLowerCase().includes('ventilation_activated') || key.toLowerCase().includes('ventilation_desactivated')) {
            return ventilacion;
        }
        if (key.toLowerCase().includes('heating_activated') || key.toLowerCase().includes('heating_desactivated')) {
            return calefaccion;
        }
        if (key.toLowerCase().includes('conection_controller')) {
            return enchufe;
        }
        if (key.toLowerCase().includes('stable_humidity')) {
            return humedad;
        }
        if (key.toLowerCase().includes('stable_temperature')) {
            return temperatura;
        }
    };

    // Control manual: Función que retorna el nombre descriptivo del sensor o estado según la clave proporcionada.
    const getNombre = (key) => {
        if (key.includes('manual_heating')) {
            return 'Calefacción'
        }
        if (key.includes('manual_humedifier')) {
            return 'Humidificador'
        }
        if (key.includes('manual_ventilation')) {
            return 'Ventilación'
        }
        if (key.includes('manual_valve')) {
            return 'Válvula de agua'
        }
    }

    // // Control Automatico: Función que retorna el nombre descriptivo del sensor o estado según la clave proporcionada.
    const getNombre2 = (key) => {
        if (key.includes('heating_activated') || key.includes('heating_desactivated')) {
            return 'Calefacción'
        }
        if (key.includes('humedifier_activated') || key.includes('humedifier_desactivated')) {
            return 'Humidificador'
        }
        if (key.includes('ventilation_activated') || key.includes('ventilation_desactivated')) {
            return 'Ventilación'
        }
        if (key.includes('valve_activated') || key.includes('valve_desactivated')) {
            return 'Válvula de agua'
        }
        if (key.includes('conection_controller')) {
            return 'Conexión del controlador'
        }
        if (key.includes('stable_humidity')) {
            return 'Humedad'
        }
        if (key.includes('stable_temperature')) {
            return 'Temperatura'
        } else { return '' }
    }

    return (
        <ImageBackground
            backgroundColor='#EDFDF2'
            style={styles.container}
            resizeMode="cover"
        >

            {/* Verificar si los datos están cargados */}
            {(data === null || dataAutomatica === null) ? (
                // Mostrar indicador de carga o un mensaje si los datos aún no están disponibles
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#19A44E" />
                    <Text>...</Text>
                </View>
            ) : (
                // Si los datos están disponibles, renderizar el 
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <Text style={styles.title}>{item.details.controller_title}</Text>
                    <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderWidth: 0.2, borderRadius: 12 }}>
                        <Text style={styles.sectionTitle}>Sensores</Text>
                        <View style={styles.cardsContainer1}>
                            {data &&
                                Object.entries(data)
                                    .filter(([, value]) => typeof value !== 'boolean')
                                    .map(([key, value]) => {
                                        const displayValue = key === 'Temperatura'
                                            ? `${value}°C`
                                            : key === 'Humedad'
                                                ? `${value}%`
                                                : value;

                                        const iconName = key === 'Temperatura'
                                            ? 'thermometer'
                                            : key === 'Humedad'
                                                ? 'tint'
                                                : null;

                                        return (
                                            <View key={key} style={styles.card1}>
                                                {iconName && (
                                                    <Icon
                                                        name={iconName}
                                                        size={20}
                                                        color="#000"
                                                        style={{ marginRight: 3, marginTop: -10, color: '#12862F' }}
                                                    />
                                                )}
                                                <Text style={styles.label}>
                                                    {key.replace(/_/g, ' ')}: {displayValue}
                                                </Text>
                                            </View>
                                        );
                                    })}
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderWidth: 0.2, borderRadius: 12, }}>
                        <Text style={styles.sectionTitle}>Control Manual</Text>
                        {loading && <ActivityIndicator size="large" color="black" />}
                        <View style={styles.cardsContainer}>
                            {data &&
                                Object.entries(data)
                                    .filter(([key, value]) => typeof value === 'boolean' && value !== null) 
                                    .map(([key, value]) => (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                styles.card,
                                                { backgroundColor: value ? 'white' : 'white' },
                                            ]}
                                            onPress={() => handleChangeState(key, !value)}
                                        >
                                            <View style={styles.columnContainer}>
                                                <View style={styles.columnLeft}>
                                                    <View style={styles.imageContainerEstados}>
                                                        <Image
                                                            source={getImageSource(key.replace(/_/g, ' '), value)}
                                                            style={styles.statusImage}
                                                        />
                                                    </View>
                                                    <Text style={styles.labelEstados}>{getNombre(key)}</Text>
                                                </View>

                                                <View style={styles.columnRight}>
                                                    <Switch
                                                        value={value}
                                                        onValueChange={() => handleChangeState(key, !value)}
                                                        thumbColor="white"
                                                        trackColor={{ false: '#ccc', true: 'black' }} 
                                                        disabled={!dataAutomatica.conection_controller}
                                                        style={dataAutomatica.conection_controller ? {} : styles.disabledSwitch} 
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderWidth: 0.2, borderRadius: 12 }}>
                        <Text style={styles.sectionTitle}>Controladores Automáticos</Text>
                        <View style={styles.cardsContainer2}>
                            {dataAutomatica &&
                                Object.entries(dataAutomatica)
                                    .filter(([key, value]) => typeof value === 'boolean' && value !== null)
                                    .map(([key, value]) => (
                                        <Pressable
                                            key={key}
                                            style={({ pressed }) => [
                                                styles.card2,
                                                {
                                                    backgroundColor: value ? 'white' : '#f0f0f0',
                                                    opacity: pressed ? 1 : 1, 
                                                },
                                            ]}
                                            onPressIn={() => setPressedKey(key)} 
                                            onPressOut={() => setPressedKey(null)}
                                        >
                                            <View style={styles.imageContainerEstados2}>
                                                <Image
                                                    source={getImageSource2(key)}
                                                    style={[styles.statusImage2, getImageStyle(key, value)]}
                                                />
                                            </View>

                                            {pressedKey === key && (
                                                <Text style={styles.pressedText}>{getNombre2(key)}</Text>
                                            )}
                                        </Pressable>
                                    ))}
                        </View>
                    </View>

                </ScrollView>
            )}

        </ImageBackground>
    );
}

// Define los estilos de la pantalla, contenedores, imágenes y texto en la vista "Monitero de controlador"
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        paddingTop: '7%',
        height: '120%'
    },
    disabledSwitchOn: {
        color: 'red',
        opacity: 1,
    },
    disabledSwitch: {
        color: 'red',
        opacity: 0.3, 
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#12682F',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#12682F',
    },
    cardsContainer1: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
    },

    cardsContainer2: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        padding: width * 0.05, 
        height: width * 0.7,
    },
    card2: {
        width: width > 400 ? '30%' : '30%',
        aspectRatio: 1, 
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    imageContainerEstados2: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusImage2: {
        width: 20,
        height: 20,
    },
    pressedText: {
        position: 'absolute',
        bottom: 70,
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        opacity: 10,
        color: 'black',
        padding: 5,
        borderRadius: 5,
        fontSize: 15,
        borderWidth: 0.2,
        width: 100,
    },

    card1: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,  
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 0
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 30,
    },
    cardControl: {
        width: '48%',
        backgroundColor: '#58C45E',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dataContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    dataContainer2: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    dataItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dataItem2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelEstados: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageContainerEstados: {
        marginTop: -9,
        paddingRight: 10,
    },
    columnContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: -40,
    },
    columnContainer2: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: -40,
    },
    columnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    columnRight: {
        padding: 2,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    statusImage: { 
        width: 18,
        height: 18,
    },
    num: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default MonitorearControladores;
