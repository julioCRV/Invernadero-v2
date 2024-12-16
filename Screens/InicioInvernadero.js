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
        id: '2',
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
    const [isVisible, setIsVisible] = useState(true);
    const [editedData, setEditedData] = useState({
        tipe: item.tipe,
        description: item.description,
        feature: item.feature,
    });

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
        //Click en Editar
        setModalVisible(true);
        setIsEditing(true);
        setIsVisible(false);
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
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', paddingTop: 30, color: '#12682F' }}>Titulo:</Text>
                                    <TextInput
                                        style={style.modalText}
                                        value={editedData.tipe}
                                        onChangeText={(value) => handleInputChange('tipe', value)}
                                    />
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', color: '#12682F' }}>Descripción:</Text>
                                    <TextInput
                                        value={editedData.description}
                                        onChangeText={(value) => handleInputChange('description', value)}
                                        multiline={true} // Permite múltiples líneas
                                        numberOfLines={20} // Número de líneas visibles por defecto
                                        style={{ borderColor: 'black', borderWidth: 1, marginBottom: 20, }}
                                    />
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', color: '#12682F' }}>Tipo de Cultivo:</Text>
                                    {editedData.feature.map((item, index) => (
                                        <TextInput
                                            style={{ borderColor: 'black', borderWidth: 1 }}
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
                                <Text style={style.modalTextVer} numberOfLines={2}>{item.tipe}</Text>
                                <View style={{ margin: 20 }}>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', fontSize: 16, color: '#12682F' }}>Descripción:</Text>
                                    <Text style={{ fontSize: 16, marginBottom: 20 }}>{item.description}</Text>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: '700', fontSize: 16, color: '#12682F' }}>Tipo de Cultivo:</Text>
                                    {item.feature.map((item, index) => (
                                        <Text style={{ fontSize: 16 }} key={index}>* {item}</Text>
                                    ))}
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
                style={{ width: 200, height: 100 }} // Ajusta el tamaño de la imagen
            />
            <Text style={styles.title2}>{item.tipe}</Text>

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


export default function GreenManagerTc(props) {
    const navigation = useNavigation();
    const back = () => {
        {/**FUNCION PARA SALIR CON EL BOTON SUPERIOR DERECHO */ }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                {/* <Ionicons name="arrow-back-circle-outline" size={35} color="black" onPress={() => navigation.navigate('IniciarSesion')} /> */}
                <Text style={styles.topTitle}>Green Manager TC</Text>
                {/* <Feather name="log-out" size={28} color="black" onPress={() => navigation.navigate('IniciarSesion')} /> */}
            </View>
            <View style={styles.bodybox}>
                <Text style={styles.title}>Mis Invernaderos</Text>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <BoxItem item={item} />}
                    keyExtractor={item => item.id}
                // contentContainerStyle={style.container}
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