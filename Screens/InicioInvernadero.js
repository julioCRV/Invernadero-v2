import { Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, TextInput } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import Foundation from '@expo/vector-icons/Foundation';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


const data = [
    {
        id: '1',
        cod_controlador: "9173690",
        image: require('../assets/zanahoria.png'),
        tipe: 'Cultivo de Zanahorias',
        description: 'Este invernadero está especialmente diseñado para el cultivo de zanahorias, proporcionando un suelo suelto y bien drenado. Las condiciones controladas permiten un crecimiento uniforme y saludable durante todo el año.',
        feature: ['Control de Humedad', 'Riego por Goteo'],
    },
    {
        id: '1',
        cod_controlador: "249978",
        image: require('../assets/zanahoria.png'),
        tipe: 'Invernadero de Zanahorias Orgánicas',
        description: 'Este invernadero está optimizado para el cultivo de zanahorias orgánicas. Utiliza un sistema de control automático de riego y monitoreo de nutrientes para asegurar el crecimiento saludable de zanahorias sin el uso de pesticidas. Ideal para la producción de alimentos ecológicos de alta calidad.',
        feature: ['Riego por Goteo Automatizado', 'Control de temperatura', 'Producción Ecológica'],

    },
    // {
    //     id: '3',
    //     image: require('../assets/tomate.png'), 
    //     tipe: 'Cultivo de Tomates',
    //     description: 'Este invernadero está diseñado específicamente para el cultivo de tomates, con un control preciso de la temperatura y los niveles de CO2 para maximizar la producción de frutas saludables y sabrosas.',
    //     feature: ['Control de Temperatura', 'Riego Automatizado', 'Soporte para Trepado'],
    // },
    // {
    //     id: '4',
    //     image: require('../assets/fresa.png'), 
    //     tipe: 'Cultivo de Frutillas',
    //     description: 'Diseñado para el cultivo de frutillas, este invernadero mantiene las condiciones ideales de humedad y temperatura, permitiendo la producción de frutillas frescas y dulces durante todo el año.',
    //     feature: ['Clima Controlado', 'Riego por Goteo', 'Monitoreo de Humedad'],
    // }
];


const BoxItem = ({ item, }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        tipe: item.tipe,
        description: item.description,
        feature: item.feature,
    });

    const goDetalles = () => {
        //Click en Detalles
        setModalVisible(true);
        setIsEditing(false);
    }
    const goMonitorear = () => {
        //Click en Monitorear
        // navigation.navigate('VerConfig', { name, imageUrl });
        navigation.navigate('Monitorear', { item });
    }
    const goDashboard = () => {
        //Click en Dashboard
        navigation.navigate('Dashboard');
    }
    const goEditar = () => {
        //Click en Editar
        setModalVisible(true);
        setIsEditing(true);
    }

    const handleSave = () => {
        item.tipe = editedData.tipe;
        item.description = editedData.description;
        item.feature = editedData.feature;
        setModalVisible(false);
    };

    const handleInputChange = (name, value) => {
        setEditedData({
            ...editedData,
            [name]: value,
        });
    };

    return (
        <View style={style.box}>
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
                            style={{ position: 'absolute', right: 10, top: 5, borderRadius: 100, borderColor: 'black', borderWidth: 1, width: 25, height: 25 }}
                        >
                            <Text style={{ textAlign: 'center' }}>x</Text>
                        </Pressable>

                        {/* Modo de Edición o Vista */}
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={style.modalText}
                                    value={editedData.tipe}
                                    onChangeText={(value) => handleInputChange('tipe', value)}
                                />
                                <Text style={{ alignSelf: 'flex-start', fontWeight: '700' }}>Descripción:</Text>
                                <TextInput
                                    value={editedData.description}
                                    onChangeText={(value) => handleInputChange('description', value)}
                                    multiline={true} // Permite múltiples líneas
                                    numberOfLines={4} // Número de líneas visibles por defecto
                                />
                                <Text style={{ alignSelf: 'flex-start', fontWeight: '700' }}>Tipo de Invernadero:</Text>
                                {editedData.feature.map((item, index) => (
                                    <TextInput
                                        key={index}
                                        value={item}
                                        onChangeText={(value) => {
                                            const newFeatures = [...editedData.feature];
                                            newFeatures[index] = value;
                                            setEditedData({ ...editedData, feature: newFeatures });
                                        }}
                                        multiline={true} // Permite múltiples líneas
                                        numberOfLines={1} // Número de líneas visibles por defecto
                                    />
                                ))}
                                <Pressable style={style.button} onPress={handleSave}>
                                    <Text>Guardar</Text>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Text style={style.modalText} numberOfLines={2}>{item.tipe}</Text>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: '700' }}>Descripción:</Text>
                                <Text>{item.description}</Text>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: '700' }}>Tipo de Invernadero:</Text>
                                {item.feature.map((item, index) => (
                                    <Text key={index}>*{item}</Text>
                                ))}
                            </>
                        )}

                        <Pressable title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            {/**el item.image debe entrar en un elemento imagen con uri */}
            <View >
                <Image
                    source={item.image} // Ruta relativa a la imagen local
                    style={{ width: 100, height: 100 }} // Ajusta el tamaño de la imagen
                />
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Pressable style={{ alignItems: 'center', marginRight: 5 }} onPress={() => goDetalles()}>
                    <FontAwesome name="file-text-o" size={24} color="black" />
                    <Text style={{ fontSize: 10 }}>Detalles</Text>
                </Pressable>
                <Pressable style={{ alignItems: 'center', marginRight: 5 }} onPress={() => goMonitorear()}>
                    <FontAwesome6 name="sun-plant-wilt" size={24} color="black" />
                    <Text style={{ fontSize: 10 }}>Monitorear</Text>
                </Pressable>
                <Pressable style={{ alignItems: 'center', marginRight: 5 }} onPress={() => goDashboard()}>
                    <Octicons name="graph" size={24} color="black" />
                    <Text style={{ fontSize: 10 }}>Dashboard</Text>
                </Pressable>
                <Pressable style={{ alignItems: 'center', marginRight: 5 }} onPress={() => goEditar()} >
                    <Foundation name="page-edit" size={24} color="black" />
                    <Text style={{ fontSize: 10 }}>Editar</Text>
                </Pressable>
            </View>
        </View>
    )

};


export default function GreenManagerTc(props) {

    const back = () => {
        {/**FUNCION PARA SALIR CON EL BOTON SUPERIOR DERECHO */ }
    }

    return (
        <View style={[style.mainContainer, { width: '100%', height: '100%' }]}>
            {/**Space */}
            <View style={{ height: 0 }} />
            {/**Caja del titulo */}

            {/* <View style={style.boxTitle}>
                <Text style={style.title}>Green Manager TC</Text>
                <Pressable onPress={() => back()}>
                    <Entypo name="log-out" size={24} color="black" />
                </Pressable>
            </View>
            <View style={{ height: 20 }} /> */}

            {/**Lista de GreenHouses */}

            <View style={{ width: '100%', height: FLATLIST_HEIGHT }}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <BoxItem item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={style.container}
                />
            </View>
        </View>
    )
}


const { height } = Dimensions.get('window')

const TITLE_HEIGHT = 70;
const FLATLIST_HEIGHT = height - 50 - TITLE_HEIGHT;

const BOX_HEIGHT = 150; // Altura predefinida
const style = StyleSheet.create({
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
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    image: {
        width: 100,
        height: 100, // cuadrada, misma anchura y altura
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'black',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
        flex: 1,
    },
    buttonText: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'center',
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
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 15,

    },
    button: {
        borderWidth: 1,
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 2,
        shadowColor: 'black',
        elevation: 1,
    },
})


