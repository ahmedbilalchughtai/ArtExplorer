import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from '../screens/Home';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import MyProfile from '../screens/MyProfile';
import Sell from '../screens/Sell';
import ProductDetails from '../screens/ProductDetails';
import Ads from '../screens/Ads';
import Liked from '../screens/Liked';
import useAuth from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { LikedProvider } from '../context/Cartctx';
import { UserProvider } from '../context/Usercontext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.customTabButton}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Liked" component={Liked} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="Ads" component={Ads} />
      <Stack.Screen name="Liked" component={Liked} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Sell':
              iconName = 'add';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? '#323232' : color} // Change color based on focus
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
      />
      <Tab.Screen 
        name="Sell" 
        component={Sell}
        options={{ 
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { user } = useAuth(); // Use the custom hook to get the authentication state

  return (
    <UserProvider>
      <LikedProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            {user ? (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AppTabs" component={AppTabs} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </GestureHandlerRootView>
      </LikedProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    borderTopWidth: 0,
    elevation: 5,
    backgroundColor: '#fff', // Dark blue color for the tab bar
    borderTopColor: '#000',
  },
  customTabButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Bright blue color for the custom button
    borderRadius: 50,
    height: 55,
    width: 55,
    elevation: 10,
  },
});
