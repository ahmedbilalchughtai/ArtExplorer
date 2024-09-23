import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useLiked } from '../context/Cartctx'; // Assuming this is your cart context
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons

const { width, height } = Dimensions.get('window');

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const { LikedItems, addToLiked } = useLiked();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToLiked = () => {
    try {
      const isProductInLiked = LikedItems.some(item => item.id === product.id);
      if (isProductInLiked) {
        Alert.alert('Post already in Liked', 'This post is already in your Liked Album.');
        return;
      }
      addToLiked(product);
      console.log('Added to Liked:', product);
    } catch (error) {
      console.error('Error adding to Liked:', error);
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderImage = ({ item, index }) => (
    <TouchableOpacity onPress={() => openImageModal(index)}>
      <Image
        source={{ uri: item }}
        style={[styles.productImage, { resizeMode: 'contain' }]}
        onError={error => console.error('Image loading error:', error)}
      />
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={product.imageUris}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={getItemLayout}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="category" size={20} color="#000" style={styles.icon} />
          <Text style={styles.infoText}>{product.category || 'No Category'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color="#000" style={styles.icon} />
          <Text style={styles.infoText}>{product.artistName || 'No Artist Name'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="description" size={20} color="#000" style={styles.icon} />
          <Text style={styles.infoText}>{product.description || 'No Description'}</Text>
        </View>
      </View>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.addToLikedButtonContainer}
      >
        <Button mode="contained" onPress={handleAddToLiked} style={styles.addToLikedButton} labelStyle={styles.addToLikedButtonText}>
          Like
        </Button>
      </LinearGradient>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleCloseModal}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={styles.modalCloseText}>X</Text>
          </TouchableOpacity>
          <FlatList
            data={product.imageUris}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.fullscreenImage}
                resizeMode="contain" // Preserve aspect ratio and fit within the container
              />
            )}
            horizontal
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={getItemLayout}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  productImage: {
    justifyContent: 'center',
    width: width - 40,
    height: 320,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  addToLikedButtonContainer: {
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addToLikedButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  addToLikedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height * 0.8, // Set height to 80% of the screen height
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default ProductDetails;
