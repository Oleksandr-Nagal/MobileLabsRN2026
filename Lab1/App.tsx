import React from 'react';
import { StyleSheet, View, Image, Text, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

const Header = () => (
    <View style={styles.headerContainer}>
        <Image
            source={require('./assets/ztu-logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
        <Text style={styles.headerTitle}>FirstMobileApp</Text>
    </View>
);

const Footer = () => (
    <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Нагаль Олександр, група ВТ-22-1</Text>
    </View>
);

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <Header />
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarActiveTintColor: '#007AFF',
                            tabBarInactiveTintColor: 'gray',
                            tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
                            tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
                            tabBarStyle: { backgroundColor: '#fff', elevation: 0 },
                            tabBarShowIcon: true,
                        }}
                    >
                        <Tab.Screen
                            name="Головна"
                            component={HomeScreen}
                            options={{
                                tabBarLabel: 'Головна',
                                tabBarIcon: ({ color }: { color: string }) => <Ionicons name="home" size={18} color={color} />
                            }}
                        />
                        <Tab.Screen
                            name="Галерея"
                            component={GalleryScreen}
                            options={{
                                tabBarLabel: 'Галерея',
                                tabBarIcon: ({ color }: { color: string }) => <Ionicons name="images" size={18} color={color} />
                            }}
                        />
                        <Tab.Screen
                            name="Профіль"
                            component={ProfileScreen}
                            options={{
                                tabBarLabel: 'Профіль',
                                tabBarIcon: ({ color }: { color: string }) => <Ionicons name="person" size={18} color={color} />
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
                <Footer />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    logo: { width: 80, height:80, marginRight: 105 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    footerContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    footerText: { fontSize: 12, color: '#666' },
});