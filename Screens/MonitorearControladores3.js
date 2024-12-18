import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Switch, Image, Dimensions, TouchableOpacity, ImageBackground, Pressable, ActivityIndicator } from "react-native";
import { useRoute } from '@react-navigation/native';
import { calefaccion, humidificador, valvula, ventilacion, enchufe, temperatura, humedad } from "../assets/estados/estados";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const MonitorearControladores = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const [pressedKey, setPressedKey] = useState(null);
    // const [data, setData] = useState(null);
    // const [dataAutomatica, setDataAutomatica] = useState(null);
    const data = {
        manual_heating: false,
        manual_humedifier: false,
        manual_valve: false,
        manual_ventilation: false,
        Temperatura: 0, // Suponiendo que la temperatura por defecto es 0
        Humedad: 0, // Suponiendo que la humedad por defecto es 0
    };

    const dataAutomatica = {
        conection_controller: false,
        stable_humidity: false,
        stable_temperature: false,
        heating_activated: false,
        heating_desactivated: false,
        humedifier_activated: false,
        humedifier_desactivated: false,
        valve_activated: false,
        valve_desactivated: false,
        ventilation_activated: false,
        ventilation_desactivated: false,
    };

    const [loading, setLoading] = useState(false); // Estado de carga

    const fetchControllerInfo = async () => {
        let attempt = 0; // Contador de intentos
        const maxAttempts = 2; // Máximo número de intentos

        while (attempt < maxAttempts) {
            try {
                // Realizar la solicitud HTTP
                const response = await fetch('https://gmb-tci.onrender.com/controller/get_controller_information', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        controller_code: item.cod_controller,
                    }),
                });

                // Verificar si la respuesta es exitosa
                const data = await response.json();
                if (response.ok) {
                    if (data && typeof data === 'object') {
                        // Traducir claves de datos
                        const translatedData = {
                            manual_heating: data.manual_heating,
                            manual_humedifier: data.manual_humedifier,
                            manual_valve: data.manual_valve,
                            manual_ventilation: data.manual_ventilation,
                            Temperatura: data.temperature,
                            Humedad: data.humidity,
                        };

                        const translatedData2 = {
                            conection_controller: data.conection_controller,
                            stable_humidity: data.stable_humidity,
                            stable_temperature: data.stable_temperature,
                            heating_activated: data.heating_activated,
                            heating_desactivated: data.heating_deactivated,
                            humedifier_activated: data.humedifier_activated,
                            humedifier_desactivated: data.humedifier_deactivated,
                            valve_activated: data.valve_activated,
                            valve_desactivated: data.valve_deactivated,
                            ventilation_activated: data.ventilation_activated,
                            ventilation_desactivated: data.ventilation_deactivated,
                        };

                        // Actualizar estado con los datos traducidos
                        setData(translatedData);
                        setDataAutomatica(translatedData2);

                        // Si la solicitud fue exitosa, salir del bucle
                        return;
                    } else {
                        console.error('Los datos recibidos no tienen el formato esperado:', data);
                        alert('Error: Los datos no tienen el formato esperado.');
                        return; // Salir si el formato no es correcto
                    }
                } else {
                    console.error('Error en la respuesta:', data.message);
                    alert('Error en la respuesta del servidor.');
                    return; // Salir si la respuesta no es OK
                }
            } catch (error) {
                attempt++; // Incrementar contador de intentos
                console.error(`Intento ${attempt} fallido:`, error);

                if (attempt >= maxAttempts) {
                    alert(`Error al realizar la solicitud después de ${maxAttempts} intentos: ${error.message}`);
                    return; // Salir después de alcanzar el máximo de intentos
                }
            }
        }
    };



    // useEffect(() => {
    //     const fetchTwice = async () => {
    //         try {
    //             await fetchControllerInfo(); // Primera llamada
    //             setTimeout(async () => {
    //                 await fetchControllerInfo(); // Segunda llamada después de un retraso
    //             }, 2000); // Retraso de 1 segundo (puedes ajustarlo)
    //         } catch (error) {
    //             console.error('Error en fetchTwice:', error);
    //         }
    //     };
    //     fetchTwice();
    // }, []);


    // useEffect(() => {
    //     fetchControllerInfo(); // Llamada inicial

    //     const interval = setInterval(() => {
    //         fetchControllerInfo(); // Llamada cada 10 segundos
    //     }, 10000);

    //     // Limpieza del intervalo
    //     return () => clearInterval(interval);
    // }, []);

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

            setLoading(true); // Inicia el estado de carga

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        controller_code: item.cod_controller,
                        [bodyKey]: newValue, // Usa el campo correspondiente al sensor
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    await fetchControllerInfo(); // Llama al método para actualizar los datos
                    console.log('Datos actualizados');
                } else {
                    console.error('Error en la respuesta:', data.message);
                    alert('Error en la respuesta:', data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Error en la solicitud:', error);
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        }
    };

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
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <Text>Monitor 3</Text>
                <Text style={styles.title}>{item.details.controller_title}</Text>
                <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderWidth: 0.2, borderRadius: 12 }}>
                    <Text style={styles.sectionTitle}>Sensores</Text>
                    <View style={styles.cardsContainer1}>
                        {data &&
                            Object.entries(data)
                                .filter(([, value]) => typeof value !== 'boolean')
                                .map(([key, value]) => {
                                    // Agrega los símbolos según la clave
                                    const displayValue = key === 'Temperatura'
                                        ? `${value}°C`
                                        : key === 'Humedad'
                                            ? `${value}%`
                                            : value;

                                    // Selecciona el ícono según la clave
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
                    {/* {loading && <ActivityIndicator size="large" color="black" />} */}
                    <View style={styles.cardsContainer}>
                        {data &&
                            Object.entries(data)
                                .filter(([key, value]) => typeof value === 'boolean' && value !== null) // Filtrar valores booleanos y no null
                                .map(([key, value]) => (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.card,
                                            { backgroundColor: value ? 'white' : 'white' }, // Cambia el color de fondo según el valor de `value`
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
                                                {/* <Text style={styles.labelEstados}>{getNombre(key.replace(/_/g, ' '))}</Text> */}
                                            </View>

                                            <View style={styles.columnRight}>
                                                <Switch
                                                    value={value}
                                                    onValueChange={() => handleChangeState(key, !value)}
                                                    thumbColor="white"
                                                    trackColor={{ false: '#ccc', true: 'black' }} // Cambia el color del Switch cuando está activo
                                                    disabled={!dataAutomatica.conection_controller}
                                                    style={dataAutomatica.conection_controller ? {} : styles.disabledSwitch}  // Aplica estilo adicional cuando está deshabilitado
                                                />
                                            </View>
                                        </View>
                                        {/* <Text>{value ? 'Encendido' : 'Apagado'}</Text> */}
                                    </TouchableOpacity>
                                ))}
                    </View>
                </View>

                <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderWidth: 0.2, borderRadius: 12 }}>
                    <Text style={styles.sectionTitle}>Controladores Automáticos</Text>
                    <View style={styles.cardsContainer2}>
                        {dataAutomatica &&
                            Object.entries(dataAutomatica)
                                .filter(([key, value]) => typeof value === 'boolean' && value !== null) // Filtrar valores booleanos y no null
                                .map(([key, value]) => (
                                    <Pressable
                                        key={key}
                                        style={({ pressed }) => [
                                            styles.card2,
                                            {
                                                backgroundColor: value ? 'white' : '#f0f0f0',
                                                opacity: pressed ? 1 : 1, // Mantén la opacidad fija incluso al presionar
                                            },
                                        ]}
                                        onPressIn={() => setPressedKey(key)} // Mostrar el nombre al presionar
                                        onPressOut={() => setPressedKey(null)} // Ocultar el nombre al soltar<
                                    >
                                        <View style={styles.imageContainerEstados2}>
                                            <Image
                                                source={getImageSource2(key)}
                                                style={[styles.statusImage2, getImageStyle(key, value)]} // Agrega el estilo dinámico
                                            />
                                        </View>

                                        {pressedKey === key && (
                                            <Text style={styles.pressedText}>{getNombre2(key)}</Text> // Mostrar texto
                                        )}
                                    </Pressable>
                                ))}
                    </View>
                </View>

            </ScrollView>
        </ImageBackground>
    );
}

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
        opacity: 1, // Reducir opacidad para indicar que está deshabilitado
    },
    disabledSwitch: {
        color: 'red',
        opacity: 0.3, // Reducir opacidad para indicar que está deshabilitado
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
        flexDirection: 'row', // Los elementos se distribuyen en filas
        flexWrap: 'wrap', // Permite que los elementos pasen a la siguiente fila
        justifyContent: 'space-between', // Espacio uniforme entre elementos
    },

    cardsContainer2: {
        flexDirection: 'row', // Los elementos se distribuyen en filas
        flexWrap: 'wrap', // Permite que los elementos pasen a la siguiente fila
        justifyContent: 'space-between', // Espacio uniforme entre elementos
        padding: width * 0.05, // Ajustamos el padding según el ancho de la pantalla
        // borderWidth: 1,
        height: width * 0.7,
    },
    card2: {
        width: width > 400 ? '30%' : '30%', // Tres elementos por fila en pantallas grandes, dos en pantallas pequeñas
        aspectRatio: 1, // Mantiene el elemento cuadrado
        marginBottom: 10, // Espaciado entre filas
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
        // marginBottom: 10,
        padding: 10,
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 8,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 0
    },
    card: {
        // width: '48%',
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
        // fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        // fontWeight: 'bold',
        marginBottom: 10,
        // color: '#12682F',
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageContainerEstados: {
        marginTop: -9,
        paddingRight: 10, // Espacio entre el círculo y el switch
    },
    columnContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Distribuye los hijos entre los extremos
        position: 'relative',
        marginBottom: -40,
    },
    columnContainer2: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Distribuye los hijos entre los extremos
        position: 'relative',
        marginBottom: -40,
    },
    columnLeft: {
        // Alineación del hijo izquierdo
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    columnRight: {
        // marginBottom: 1,
        // Alineación del hijo derecho
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    statusImage: {  // borderColor: 'black',borderWidth: 1,
        width: 18,
        height: 18,
        // marginRight: 10,
    },
    num: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        // color: '#fa6900',

    },
});


export default MonitorearControladores;
