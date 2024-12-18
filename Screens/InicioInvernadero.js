import { Dimensions, FlatList, Image, Modal, Pressable, StatusBar, ImageBackground, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, TextInput } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import Foundation from '@expo/vector-icons/Foundation';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import IconPlanta from '../assets/iconPlanta.png';
import { useRoute } from '@react-navigation/native';

const cropImages = {
    1: require('../assets/zanahoria.png'),
    2: require('../assets/lechuga.png'),
    3: require('../assets/tomate.png'),
    4: require('../assets/frutilla.png'),
};
const BoxItem = ({ item, onReload }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [editedData, setEditedData] = useState({
        tipe: item.details.controller_title,
        description: item.details.controller_description,
        feature: item.details.crop_name,
        cod: item.details.controller_title,
    });

    // console.log(editedData);
    const [crops, setCrops] = useState([]);

    const [selectedCrop, setSelectedCrop] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');

    // // Efecto para inicializar las variables con editedData cuando el componente se monta
    // useEffect(() => {
    //     if (editedData) {
    //         setTitulo(editedData.tipe || '');
    //         setDescripcion(editedData.description || '');
    //         setTipo(editedData.feature || '');
    //         setSelectedCrop(crops.find(crop => crop.crop_code === editedData.cod) || '');
    //     }
    //     // console.log("Valores inicializados:", { titulo, descripcion, tipo });
    // }, [goEditar]);

    useEffect(() => {
        setEditedData({
            tipe: item.details?.controller_title || "",
            description: item.details?.controller_description || "",
            feature: item.details?.crop_name || "",
            cod: item.details?.controller_title || "",
        });
    }, [item.details]);

    const fetchCrops = async () => {
        try {
            const response = await fetch('https://gmb-tci.onrender.com/crop/get_crops', {
                method: 'GET', // Cambiar a 'POST' si la API lo requiere
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const data = await response.json(); // Suponiendo que la API devuelve JSON
            const defaultCrop = data.find(crop => crop.crop_code === item.cod_crop);
            if (defaultCrop) {
                setSelectedCrop(defaultCrop);
            }
            setCrops(data); // Guarda los datos obtenidos en el estado `crops`
        } catch (error) {
            console.error('Error al obtener los cultivos:', error);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const goDetalles = () => {
        //Click en Detalles
        setModalVisible(true);
        setIsEditing(false);
        setIsVisible(true);
    }
    const goMonitorear = () => {
        //Click en Monitorear
        // navigation.navigate('VerConfig', { name, imageUrl });
        navigation.navigate('Monitorear', { item });
    }
    const goDashboard = () => {
        //Click en Dashboard
        navigation.navigate('Dashboard', { item });
    }
    const goEditar = () => {
        setTitulo(item.details.controller_title);
        setDescripcion(item.details.controller_description);
        setTipo(editedData.feature || '');
        // setSelectedCrop(it);

        setModalVisible(true);
        setIsEditing(true);
        setIsVisible(false);
    }

    // Función para actualizar el estado 'editedData' cuando se recargan los datos
    const updateData = (newItem) => {
        setEditedData({
            tipe: newItem.tipe,
            description: newItem.description,
            feature: newItem.feature,
            cod: newItem.cod,
        });
    };

    // Usamos el efecto para actualizar 'editedData' cuando 'item' cambia
    useEffect(() => {
        updateData(item);
    }, [item]); // Esto actualizará 'editedData' cada vez que 'item' cambie

    const handleSave = async () => {
        const controllerData = {
            controller_code: item.cod_controller,
            title: titulo,
            description: descripcion,
            cod_crop: selectedCrop.crop_code,
        };

        try {
            const response = await fetch('https://gmb-tci.onrender.com/controller/update_controller_detail', {
                method: 'PUT', // Método HTTP correcto para actualizar
                headers: {
                    'Content-Type': 'application/json', // Encabezado para JSON
                },
                body: JSON.stringify(controllerData), // Convertir datos a JSON
            });

            const result = await response.json(); // Parsear la respuesta como JSON

            if (response.ok) {
                console.log('Actualización exitosa:', result);
                onReload();
            } else {
                console.error('Error en la actualización:', result.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        setModalVisible(false);
    };

    // Handlers para cambiar los valores
    const handleTituloChange = (value) => setTitulo(value);
    const handleDescripcionChange = (value) => setDescripcion(value);
    const handleTipoChange = (value) => setTipo(value);


    const handleSelect = (crop) => {
        setSelectedCrop(crop);
    };

    return (
        <View style={styles.box}>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={style.modalBackground}>
                    <View style={style.modalContainer}>
                        {/* Botón de cerrar */}
                        <Pressable
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Icon name="close" size={20} color="black" />
                        </Pressable>



                        {/* Vista de modo de edición*/}
                        {isEditing ? (
                            <>
                                <Text style={style.modalTitulo}>Editar detalles</Text>
                                <View style={{ padding: 15 }}>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '70', paddingTop: 30, color: '#12682F' }}>Titulo:</Text>
                                    <TextInput
                                        style={style.modalText}
                                        value={titulo}
                                        onChangeText={handleTituloChange}
                                    />
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', color: '#12682F' }}>Descripción:</Text>
                                    <TextInput
                                        value={descripcion}
                                        onChangeText={handleDescripcionChange}
                                        multiline={true} // Permite múltiples líneas
                                        numberOfLines={20} // Número de líneas visibles por defecto
                                        style={{ borderColor: 'black', borderWidth: 1, marginBottom: 20, }}
                                    />
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', color: '#12682F' }}>Tipo de Cultivo:</Text>
                                    <FlatList
                                        data={crops}
                                        keyExtractor={(item) => item.crop_code}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.itemA,
                                                    selectedCrop?.crop_code === item.crop_code && styles.selectedItemA
                                                ]}
                                                onPress={() => handleSelect(item)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.itemTextA,
                                                        selectedCrop?.crop_code === item.crop_code && styles.selectedTextA
                                                    ]}
                                                >
                                                    {item.crop_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <View style={style.buttonsContainer}>
                                        <Pressable style={style.button2} onPress={() => setModalVisible(false)} >
                                            <Text style={style.textButton}>Cancelar</Text>
                                        </Pressable>
                                        <Pressable style={style.button} onPress={handleSave}>
                                            <Text style={style.textButton}>Guardar</Text>
                                        </Pressable>
                                    </View>
                                </View>

                            </>
                        ) : (
                            <>
                                <Text style={style.modalTitulo}>Detalles</Text>
                                <Pressable style={{ alignItems: 'center', marginRight: 220, marginBottom: 20 }} onPress={goEditar}>
                                    <Foundation name="page-edit" size={24} color="black" />
                                    <Text style={{ fontSize: 15 }}>Editar</Text>
                                </Pressable>

                                <Text style={style.modalTextVer} numberOfLines={2}>{item.details.controller_title}</Text>
                                <View style={{ margin: 20 }}>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', fontSize: 16, color: '#12682F' }}>Descripción:</Text>
                                    <Text style={{ fontSize: 16, marginBottom: 20 }}>{item.details.controller_description}</Text>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', fontSize: 16, color: '#12682F' }}>Tipo de Cultivo:</Text>
                                    <Text style={{ fontSize: 16 }}>* {item.details.crop_name}</Text>
                                </View>
                            </>
                        )}
                        <Pressable title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            {/**el item.image debe entrar en un elemento imagen con uri */}

            <Image
                source={item.image} // Ruta relativa a la imagen local
                style={{ width: 320, height: 100, borderRadius: 15 }} // Ajusta el tamaño de la imagen
            />
            <Text style={styles.title2}>{item.details.controller_title}</Text>

            <StatusBar backgroundColor={color.font} />
            {/* <Text style={styles.text}>{item.description}</Text> */}
            {/**Buttons */}
            <View style={styles.boxButtons}>
                <Pressable style={[styles.button, { backgroundColor: color.font }]} onPress={() => goMonitorear()}>
                    <Image
                        source={IconPlanta} // Usa la imagen
                        style={{ width: 24, height: 24, }}
                    />
                    <Text>Monitorear</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => goDetalles()}>
                    <Ionicons name="newspaper-outline" size={24} color="black" />
                    <Text>Detalles</Text>
                </Pressable>
                <Pressable style={[styles.button, { backgroundColor: color.font }]} onPress={() => goDashboard()}>
                    <Octicons name="graph" size={24} color="black" />
                    <Text>Dashboard</Text>
                </Pressable>
            </View>
        </View>
    )

};


const InicioInvernadero = ({ dataCliente }) => {
    const [data, setData] = useState(null);
    const [reload, setReload] = useState(false); // Estado de recarga
    // const { userData } = props.route.params;
    // console.log( route, "hhhhhhhhhhh"); 

    const fetchGetInvernaderos = async () => {
        try {
            const response = await fetch('https://gmb-tci.onrender.com/controller/get_drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_code: dataCliente.user_code
                })
            });

            const data = await response.json();

            if (response.ok) {
                const updatedData = data.map((item, index) => {
                    const image = cropImages[item.cod_crop];
                    return {
                        ...item,
                        id: index + 1, // Asignar un ID único basado en el índice (comienza en 1)
                        image: image || null // Si no hay imagen asociada, se agrega null
                    };
                });

                fetchGetDetails(updatedData);
            } else {
                console.error('Error en la respuesta:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const fetchGetDetails = async (data) => {
        // Iterar sobre cada controlador en data
        for (let controller of data) {
            try {
                // Realizar la solicitud POST con fetch
                const response = await fetch('https://gmb-tci.onrender.com/controller/get_controller_detail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ controller_code: controller.cod_controller })
                });

                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }

                // Convertir la respuesta en JSON
                const controllerDetails = await response.json();

                // Añadir los detalles obtenidos al objeto del controlador
                controller.details = controllerDetails;
            } catch (error) {
                console.error(`Error al obtener los detalles para el controlador ${controller.controller_code}:`, error);
            }
        }

        const cleanControllers = (controllers) => {
            return controllers.filter(controller =>
                controller.details && typeof controller.details === 'object' && !Array.isArray(controller.details)
            );
        };
        setData(cleanControllers(data));
    };

    useEffect(() => {
        fetchGetInvernaderos();
    }, [reload]); // Dependencia de reload

    const handleReload = () => {
        setReload(prerv => !prerv); // Cambiar el valor de reload para recargar los datos
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Text style={styles.topTitle}>Green Manager TC</Text>
            </View>
            <View style={styles.bodybox}>
                <Text style={styles.title}>Mis Invernaderos</Text>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <BoxItem item={item} onReload={handleReload} />}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}


const color = {
    primary: '#A1B4AA',
    font: '#25A256',

}
const styles = StyleSheet.create({
    itemA: {
        padding: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedItemA: {
        backgroundColor: '#D3F9D8', // Color de fondo para el ítem seleccionado
    },
    itemTextA: {
        fontSize: 14,
        color: 'black',
    },
    selectedTextA: {
        color: 'green', // Color de texto para el ítem seleccionado
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topBox: {
        width: '100%',
        height: '10%',
        backgroundColor: color.font,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    bodybox: {
        width: '100%',
        height: '90%',
        backgroundColor: '#EDFDF2',
        padding: 20
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        marginVertical: 15,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: color.font,
    },
    title2: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.font,
        textAlign: 'center'
    },
    topTitle: {
        fontSize: 28,
        fontWeight: 500,
        width: '70%',
        textAlign: 'center'
    },
    input: {
        height: 40,
        paddingLeft: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: color.primary,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        width: '100%'
    },
    iconEye: {
        position: 'absolute',
        right: 15
    },
    button: {
        height: 70,
        width: '32%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '300'
    },
    containerImage: {
        width: '93%',
        height: 120,
        backgroundColor: 'black',
        marginBottom: 10
    },
    text: {
        color: color.font,
        fontSize: 18,
        fontWeight: 700
    },
    boxButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 5,
        borderRadius: 25, // Hace el botón circular
        borderColor: 'black',
        backgroundColor: '#FF1014',
        borderWidth: 1,
        width: 30, // Aumenta para mayor área de toque
        height: 30, // Aumenta para mayor área de toque
        justifyContent: 'center', // Centra el ícono horizontalmente
        alignItems: 'center', // Centra el ícono verticalmente
    },
});

const { height } = Dimensions.get('window')

const TITLE_HEIGHT = 70;
const FLATLIST_HEIGHT = height - 50 - TITLE_HEIGHT;

const BOX_HEIGHT = 200; // Altura predefinida

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        paddingTop: '18%',
        height: '120%'
    },
    mainContainer: {
        backgroundColor: '#dddddd',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 35,
        paddingHorizontal: 15,
    },
    boxTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: TITLE_HEIGHT,
        justifyContent: 'space-evenly'
    },
    title: {
        fontSize: 25,
        color: 'black',
        fontWeight: "400",
    },
    box: {
        width: '100%',
        height: BOX_HEIGHT,
        backgroundColor: '#f2f2f2',
        marginBottom: 20,
        padding: 20,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    image: {
        width: '90%',
        height: 110,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'black',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    button: {
        width: '50%',
        height: 40,
        backgroundColor: '#19A44E',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 2,
    },
    button2: {
        width: '50%',
        height: 40,
        backgroundColor: '#F7943F',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 2
    },
    textButton: {
        color: 'black',
        fontSize: 18
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'left',

    },
    modalText: {
        marginBottom: 20,
        fontSize: 14,
        borderColor: 'black',
        borderWidth: 1,
    },
    modalTextVer: {
        color: '#12682F',
        fontSize: 20,
        textAlign: 'center'
    },
    modalTitulo: {
        color: '#12682F',
        fontSize: 25,
        textAlign: 'center',
    }
})

export default InicioInvernadero;