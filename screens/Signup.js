import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (fullName && email && password && confirmPassword) {
            if (password === confirmPassword) {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    Alert.alert('Signup Successful', `Welcome, ${fullName}!`);
                    navigation.navigate('Login'); // Navigate to the Login screen
                } catch (err) {
                    Alert.alert('Signup Error', err.message);
                }
            } else {
                Alert.alert('Error', 'Your passwords do not match.');
            }
        } else {
            Alert.alert('Error', 'Please fill out all fields.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Hey!, Register to get started</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#808080"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#808080"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#808080"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#000000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#808080"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#000000" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Log In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Set background color to white
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30, // Add padding for better spacing
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2F2F2F', // Dark grey color for the title text
        marginBottom: 35,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '93%',
        padding: 13,
        borderRadius: 14,
        backgroundColor: '#F8F8F8', // Light gray background for input fields
        color: '#000000', // Dark grey text color for input
        marginBottom: 12,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '93%',
        backgroundColor: '#F8F8F8', // Light gray background for input fields
        borderRadius: 14,
        marginBottom: 10,
        paddingRight: 14, // Add padding to align the icon properly
    },
    passwordInput: {
        flex: 1,
        padding: 13,
        color: '#000000', // Dark grey text color for input
    },
    button: {
        width: '93%',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: '#2F2F2F', // Dark grey with black shade for the button background
        marginBottom: 7,
        marginTop: 25,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Dark grey color for the button text
    },
    loginText: {
        fontSize: 17,
        color: '#2F2F2F', // Dark grey color for the login text
        marginTop: 50,
        textAlign: 'center',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    loginLink: {
        fontSize: 17,
        color: '#000000', // Black color for the login link
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        borderBottomWidth: 12, // Increase the thickness of the underline
        borderBottomColor: '#000000', // Black color for the underline
        marginTop: 5, // Adjust to position the underline lower
    },
    icon: {
        padding: 14,
    },
});
