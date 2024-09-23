import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLiked } from '../context/Cartctx';

const Liked = () => {
  const { LikedItems, removeFromLiked } = useLiked();

  const renderLikedItem = ({ item }) => (
    <View style={styles.likedItem}>
      <Image source={{ uri: item.imageUris[0] }} style={styles.likedImage} />
      <Text style={styles.likedDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => removeFromLiked(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {LikedItems.length > 0 ? (
        <FlatList
          data={LikedItems}
          renderItem={renderLikedItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noItemsText}>No liked items yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  likedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 35,
  },
  likedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 20,
  },
  likedDescription: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Liked;
