import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Switch, Image, TouchableOpacity, ImageBackground } from "react-native";
import { useRoute } from '@react-navigation/native';
import {
    incendiosoff, incendioson, manualoff, manualon, riegooff, riegoon, ventiladoroff,
    ventiladoron, aireoff, aireon
} from "../assets/estados/estados";

const MonitorearControladores = () => {
    const route = useRoute();
    const { item } = route.params;
    console.log(item.cod_controlador);

    const [data, setData] = useState(null);

    // useEffect(() => {
    //     const dataRef = ref(db);
    //     onValue(dataRef, (snapshot) => {
    //         const dataFromFirebase = snapshot.val();
    //         setData(dataFromFirebase);
    //     });
    // }, []);

    const [controllerInfo, setControllerInfo] = useState(null);

    useEffect(() => {
        const fetchControllerInfo = async () => {
            try {
                const response = await fetch('https://gmb-tci.onrender.com/controller/get_controller_information', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cod_controller: item.cod_controlador
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setData(data[0]); console.log(data[0]);// Guarda la información recibida en el estado
                } else {
                    console.error('Error en la respuesta:', data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
        fetchControllerInfo();
    }, []);

    const handleChangeState = (key, newValue) => {
        // if (data && data[key] !== undefined) {
        //     const newData = {
        //         ...data,
        //         [key]: newValue
        //     };
        //     update(ref(db), newData)
        //         .then(() => console.log("Valor actualizado correctamente"))
        //         .catch((error) => console.error("Error al actualizar el valor:", error));
        // }
    };

    const getImageSource = (key, value) => {
        if (key.toLowerCase().includes('humidificacion')) {
            return value ? manualon : manualoff;
        }
        if (key.toLowerCase().includes('contra incendios')) {
            return value ? incendioson : incendiosoff;
        }
        if (key.toLowerCase().includes('bomba agua')) {
            return value ? riegoon : riegooff;
        }
        if (key.toLowerCase().includes('ventilacion')) {
            return value ? ventiladoron : ventiladoroff;
        }
        if (key.toLowerCase().includes('calefaccion')) {
            return value ? aireon : aireoff;
        }
    };

    return (
        <ImageBackground
            source={require('../assets/fondo.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>

                {/* <Text style={styles.title}>{name}</Text> */}

                <Text style={styles.sectionTitle}>Sensores:</Text>
                <View style={styles.cardsContainer}>
                    {data &&
                        Object.entries(data)
                            .filter(([, value]) => typeof value !== 'boolean')
                            .map(([key, value]) => (
                                <View key={key} style={styles.card}>
                                    <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                                    <Text style={styles.num}>{value}</Text>
                                </View>
                            ))}
                </View>

                <Text style={styles.sectionTitle}>Estados:</Text>
                <View style={styles.cardsContainer}>
                    {data &&
                        Object.entries(data)
                            .filter(([, value]) => typeof value === 'boolean')
                            .map(([key, value]) => (
                                <TouchableOpacity
                                    key={key}
                                    style={styles.card}
                                    onPress={() => handleChangeState(key, !value)}
                                >
                                    <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={getImageSource(key.replace(/_/g, ' '), value)}
                                            style={styles.statusImage}
                                        />
                                        <Text>{value ? 'Encendido' : 'Apagado'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                </View>

            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#8dfdc0',
        textAlign: 'center',

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#8dfdc0',

    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    statusImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    num: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fa6900',
    },
});


export default MonitorearControladores;
