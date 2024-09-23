import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Ads() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = auth.currentUser?.uid;
    const navigation = useNavigation();

    useEffect(() => {
        if (!userId) {
            Alert.alert('Error', 'User not authenticated');
            setLoading(false);
            return;
        }

        const loadAds = () => {
            const q = query(collection(db, 'products'), where('userId', '==', userId));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                try {
                    const adsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Fetched Ads:', adsList); // Debug log
                    setAds(adsList);
                } catch (error) {
                    console.error('Error processing ads:', error);
                    setError('Failed to process ads');
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error('Error fetching ads:', error);
                Alert.alert('Error', 'Failed to fetch ads');
                setError('Failed to fetch ads');
                setLoading(false);
            });

            return () => unsubscribe(); // Cleanup listener on unmount
        };

        loadAds();
    }, [userId]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            Alert.alert('Success', 'Ad deleted successfully');
        } catch (error) {
            console.error('Error deleting ad:', error);
            Alert.alert('Error', 'Failed to delete ad');
        }
    };

    const handlePress = (ad) => {
        navigation.navigate('AdDetails', { ad }); // Navigate to AdDetails screen
    };

    const renderAd = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
            {item.imageUris && item.imageUris.length > 0 && (
                <Image source={{ uri: item.imageUris[0] }} style={styles.adImage} />
            )}
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (error) {
        return <View style={styles.container}><Text>Error: {error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={ads}
                keyExtractor={item => item.id}
                renderItem={renderAd}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 20,
    },
    adImage: {
        width: '100%',
        height: 400,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    category: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
