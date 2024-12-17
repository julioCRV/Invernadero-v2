import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const crops = [
  { crop_code: 2, crop_name: "Lechuga" },
  { crop_code: 4, crop_name: "Frutilla" },
  { crop_code: 3, crop_name: "Tomate" },
  { crop_code: 1, crop_name: "Zanahoria" }
];

const CropSelector = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);

  const handleSelect = (crop) => {
    setSelectedCrop(crop);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selecciona un cultivo:</Text>
      <FlatList
        data={crops}
        keyExtractor={(item) => item.crop_code.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              selectedCrop?.crop_code === item.crop_code && styles.selectedItem
            ]}
            onPress={() => handleSelect(item)}
          >
            <Text
              style={[
                styles.itemText,
                selectedCrop?.crop_code === item.crop_code && styles.selectedText
              ]}
            >
              {item.crop_name}
            </Text>
          </TouchableOpacity>
        )}
      />
      {selectedCrop && <Text style={styles.selectedText}>Seleccionaste: {selectedCrop.crop_name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '55%'
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#D3F9D8', // Color de fondo para el ítem seleccionado
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  selectedText: {
    color: 'green', // Color de texto para el ítem seleccionado
    fontWeight: 'bold',
  },
});

export default CropSelector;
