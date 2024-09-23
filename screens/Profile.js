import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { useUser } from '../context/Usercontext';

export default function Profile() {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { user, updateUserData } = useUser(); // Retrieve the current user from context

  useEffect(() => {
    // Function to update user data
    const fetchUserData = async () => {
      // You may want to fetch and set the user data here if it's not already in the context
      // For example:
      // const userData = await fetchUserDataFromServer();
      // updateUserData(userData);
    };

    fetchUserData();
  }, [updateUserData]);

  const handleViewProfile = () => {
    navigation.navigate('MyProfile');
  };

  const handleMyAds = () => {
    navigation.navigate('Ads');
  };

  const handleMyPosts = () => {
    navigation.navigate('Liked');
  };


  const handleLogOut = async () => {
    try {
      await signOut();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{'Welcome'}</Text>
        <TouchableOpacity onPress={handleViewProfile}>
          <Text style={styles.viewProfile}>Edit Profile &gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={handleMyAds}>
          <Text style={styles.cardText}>My Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleMyPosts}>
          <Text style={styles.cardText}>Liked Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleLogOut}>
          <Text style={styles.cardText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  viewProfile: {
    fontSize: 18,
    color: '#000000',
  },
  cardContainer: {
    margin: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#000000',
    borderRadius: 14,
    marginBottom: 25,
    shadowColor: '#fff',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
  },
});
