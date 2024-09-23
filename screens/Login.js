import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Dialog from 'react-native-dialog';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handleLogin = async () => {
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert('Login Successful', `Welcome back!`);
                navigation.navigate('Home'); // Navigate to the Home screen
            } catch (err) {
                Alert.alert('Login Error', err.message);
            }
        } else {
            Alert.alert('Error', 'Please fill out all fields.');
        }
    };

    const handleForgotPassword = () => {
        setDialogVisible(true);
    };

    const handleSendPasswordResetEmail = async () => {
        if (resetEmail) {
            try {
                await sendPasswordResetEmail(auth, resetEmail);
                Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
                setDialogVisible(false);
                setResetEmail('');
            } catch (err) {
                Alert.alert('Error', err.message);
            }
        } else {
            Alert.alert('Error', 'Please enter your email address.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Welcome Back!</Text>

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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Reset Password</Dialog.Title>
                <Dialog.Description>
                    Enter your email address to receive a password reset link.
                </Dialog.Description>
                <Dialog.Input
                    placeholder="Email Address"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Send" onPress={handleSendPasswordResetEmail} />
            </Dialog.Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5, // Adjust padding for better spacing
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
        width: '100%', // Increased width
        padding: 15, // Increased padding
        borderRadius: 14,
        backgroundColor: '#F8F8F8', // Light gray background for input fields
        color: '#000000', // Dark grey text color for input
        marginBottom: 12,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Increased width
        backgroundColor: '#F8F8F8', // Light gray background for input fields
        borderRadius: 14,
        marginBottom: 10,
        paddingRight: 15, // Adjust padding to align the icon properly
    },
    passwordInput: {
        flex: 1,
        padding: 15, // Increased padding
        color: '#000000', // Dark grey text color for input
    },
    button: {
        width: '100%', // Increased width
        padding: 20, // Increased padding
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: '#2F2F2F', // Dark grey with black shade for the button background
        marginBottom: 7,
        marginTop: 25,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // White color for the button text
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#000000', // Dark grey color for the forgot password text
        fontWeight: 'bold',
        marginTop: 5,
    },
    signupText: {
        fontSize: 17,
        color: '#2F2F2F', // Dark grey color for the signup text
        marginTop: 50,
        textAlign: 'center',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    signupLink: {
        fontSize: 17,
        color: '#000000', // Black color for the signup link
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
