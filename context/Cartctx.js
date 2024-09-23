import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the LikedContext
const LikedContext = createContext();

// Provide the LikedContext to children components
export function LikedProvider({ children }) {
    const [likedItemsByUser, setLikedItemsByUser] = useState({});
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Load liked items from AsyncStorage when the component mounts
    useEffect(() => {
        const loadLikedItems = async () => {
            if (currentUser) {
                const userId = currentUser.uid;
                try {
                    const storedLikedItems = await AsyncStorage.getItem(`likedItems_${userId}`);
                    if (storedLikedItems) {
                        setLikedItemsByUser((prevItems) => ({
                            ...prevItems,
                            [userId]: JSON.parse(storedLikedItems),
                        }));
                    }
                } catch (error) {
                    console.error('Failed to load liked items:', error);
                }
            }
        };

        loadLikedItems();
    }, [currentUser]);

    // Save liked items to AsyncStorage
    const saveLikedItems = async (userId, items) => {
        try {
            await AsyncStorage.setItem(`likedItems_${userId}`, JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save liked items:', error);
        }
    };

    // Add an item to the liked list
    const addToLiked = (item) => {
        if (!currentUser) return; // Ensure user is logged in
        const userId = currentUser.uid;
        setLikedItemsByUser((prevItems) => {
            const userLikedItems = prevItems[userId] || [];
            const updatedItems = [...userLikedItems, item];
            saveLikedItems(userId, updatedItems);
            return {
                ...prevItems,
                [userId]: updatedItems,
            };
        });
    };

    // Remove an item from the liked list
    const removeFromLiked = (id) => {
        if (!currentUser) return; // Ensure user is logged in
        const userId = currentUser.uid;
        setLikedItemsByUser((prevItems) => {
            const userLikedItems = prevItems[userId] || [];
            const updatedItems = userLikedItems.filter(item => item.id !== id);
            saveLikedItems(userId, updatedItems);
            return {
                ...prevItems,
                [userId]: updatedItems,
            };
        });
    };

    // Clear all items from the liked list for the current user
    const clearLiked = () => {
        if (!currentUser) return; // Ensure user is logged in
        const userId = currentUser.uid;
        setLikedItemsByUser((prevItems) => {
            saveLikedItems(userId, []);
            return {
                ...prevItems,
                [userId]: [],
            };
        });
    };

    // Get liked items for the current user
    const getLikedItems = () => {
        if (!currentUser) return [];
        return likedItemsByUser[currentUser.uid] || [];
    };

    return (
        <LikedContext.Provider value={{ LikedItems: getLikedItems(), addToLiked, removeFromLiked, clearLiked }}>
            {children}
        </LikedContext.Provider>
    );
}

// Custom hook to use the LikedContext
export function useLiked() {
    return useContext(LikedContext);
}
