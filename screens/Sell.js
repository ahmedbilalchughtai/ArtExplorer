import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase'; // Import Firebase Auth
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function Sell() {
    const navigation = useNavigation();
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('3D Art');
    const [artistName, setArtistName] = useState(''); // New state for Artist Name
    const [images, setImages] = useState([]);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // No cropping
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true, // Allow multiple image selection
        });

        if (!result.canceled) {
            setImages(result.assets || []);
        }
    };

    const handleSubmit = async () => {
        if (!description || images.length === 0 || !category || !artistName) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        const userId = auth.currentUser.uid; // Get the current user's ID
        const newProduct = {
            description,
            category,
            imageUris: images.map(image => image.uri),
            userId, // Add user ID to the product
            artistName, // Add artist name to the product
        };

        try {
            await addDoc(collection(db, 'products'), newProduct);
            Alert.alert('Success', 'Product details submitted successfully!');
            setDescription('');
            setCategory('3D Art');
            setArtistName(''); // Reset artist name
            setImages([]);
            navigation.goBack(); // Navigate back to the previous screen after submission
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Post your Creative ArtWork</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Artist Name:</Text>
                <TextInput
                    style={styles.input}
                    value={artistName}
                    onChangeText={setArtistName}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Caption:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]} // Apply textArea style for multiline input
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Category:</Text>
                <Picker
                    selectedValue={category}
                    style={styles.picker}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
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
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>Pick Images</Text>
            </TouchableOpacity>

            {images.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image.uri }}
                            style={styles.imagePreview}
                        />
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>post</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
        marginTop: 50,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 34,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000000',
        textAlign: 'left',
    },
    input: {
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        color: '#000000',
        width: '100%',
        marginTop: 5,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 44, // Add padding to create space from the top line
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
        marginTop: 15,
        color: '#808080',
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    imagePicker: {
        backgroundColor: '#000', // Primary color for a formal look
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        borderColor: '#0056b3', // Darker border color for contrast
        borderWidth: 1,
    },
    imagePickerText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    imagePreview: {
        width: '48%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#000', // Formal color for submit
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: 'center',
        width: '100%',
        borderColor: '#218838', // Darker border color for contrast
        borderWidth: 1,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
