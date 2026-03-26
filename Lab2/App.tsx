import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import ContactsScreen from './screens/ContactsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function NewsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
}

function CustomDrawer(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ padding: 20, backgroundColor: '#007AFF', marginBottom: 10 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Нагаль Олександр</Text>
                <Text style={{ color: '#fff', opacity: 0.8 }}>Група ВТ-22-1</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                    headerTitleAlign: 'center',
                    drawerStyle: { width: 280 }
                }}
            >
                <Drawer.Screen name="News" component={NewsStack} options={{ title: 'Новини' }} />
                <Drawer.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Контакти' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}