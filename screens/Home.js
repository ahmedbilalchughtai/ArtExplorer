import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons

export default function Home() {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch the current user
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setCurrentUser(user.uid);
        }

        const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
            const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsList);
        }, (error) => {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'Failed to fetch products');
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        const isNotUserProduct = currentUser !== product.userId; // Ensure the product is not added by the current user
        
        return matchesCategory && isNotUserProduct;
    });

    const renderProduct = ({ item }) => {
        // Filter only image URLs from imageUris (assuming videos have a different extension)
        const imageUrl = item.imageUris?.find(uri => typeof uri === 'string' && uri.match(/\.(jpeg|jpg|gif|png)$/));

        return (
            <View style={styles.productContainer}>
                <TouchableOpacity onPress={() => handleProductPress(item)}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.productImage}
                            onError={() => console.log('Image load error')}
                        />
                    ) : (
                        <View style={styles.noImageContainer}>
                            <Text style={styles.noImageText}>No Image Available</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.productInfo}>
                    <View style={styles.infoRow}>
                        <Icon name="person" size={20} color="#000" style={styles.icon} />
                        <Text style={styles.productName}>{item.artistName || 'No Artist Name'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="description" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.productDescription}>{item.description || 'No Description'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="category" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.productCategory}>{item.category || 'No Category'}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
                <Picker.Item label="All Categories" value="All Categories" />
                <Picker.Item label="Digital Painting" value="Digital Painting" />
                <Picker.Item label="Digital Illustration" value="Digital Illustration" />
                <Picker.Item label="Graphic Design" value="Graphic Design" />
                <Picker.Item label="3D Art" value="3D Art" />
                <Picker.Item label="Pixel Art" value="Pixel Art" />
                <Picker.Item label="Concept Art" value="Concept Art" />
                <Picker.Item label="Animation" value="Animation" />
                <Picker.Item label="Photography" value="Photography" />
                <Picker.Item label="Generative Art" value="Generative Art" />
                <Picker.Item label="Augmented Reality Art" value="Augmented Reality Art" />
                <Picker.Item label="Virtual Reality Art" value="Virtual Reality Art" />
                <Picker.Item label="Web-Based Art" value="Web-Based Art" />
            </Picker>
            <View style={styles.titleContainer}>
                <View style={styles.line} />
                <Text style={styles.title}>Art Gallery</Text>
                <View style={styles.line} />
            </View>
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={renderProduct}
                numColumns={1} // Display items in a single column
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    picker: {
        width: '100%',
        height: 50,
        color: '#000000',
        marginBottom: 10,
        marginTop: 35,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 25,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        marginHorizontal: 10,
    },
    line: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#000000',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    productContainer: {
        flex: 1,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DCDCDC',
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    productImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    noImageContainer: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontSize: 16,
        color: '#000',
    },
    productInfo: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    icon: {
        marginRight: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
    },
});
