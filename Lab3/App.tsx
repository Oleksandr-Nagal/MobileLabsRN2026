import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { GameProvider } from "./context/GameContext";
import GameScreen from "./screens/GameScreen";
import ChallengesScreen from "./screens/ChallengesScreen";

const Tab = createBottomTabNavigator();

function AppContent() {
    const { isDark } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f9fafb" }}>
            <NavigationContainer
                theme={{
                    dark: isDark,
                    colors: {
                        primary: "#6366f1",
                        background: isDark ? "#111827" : "#f9fafb",
                        card: isDark ? "#1f2937" : "#ffffff",
                        text: isDark ? "#f9fafb" : "#111827",
                        border: isDark ? "#374151" : "#e5e7eb",
                        notification: "#6366f1",
                    },
                    fonts: {
                        regular: { fontFamily: "System", fontWeight: "400" },
                        medium: { fontFamily: "System", fontWeight: "500" },
                        bold: { fontFamily: "System", fontWeight: "700" },
                        heavy: { fontFamily: "System", fontWeight: "800" },
                    },
                }}
            >
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => {
                            const iconName =
                                route.name === "Game"
                                    ? "game-controller-outline"
                                    : "trophy-outline";
                            return (
                                <Ionicons name={iconName as any} size={size} color={color} />
                            );
                        },
                        tabBarActiveTintColor: "#6366f1",
                        tabBarInactiveTintColor: isDark ? "#9ca3af" : "#6b7280",
                        tabBarStyle: {
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            borderTopColor: isDark ? "#374151" : "#e5e7eb",
                            paddingBottom: 4,
                            height: 56,
                        },
                    })}
                >
                    <Tab.Screen
                        name="Game"
                        component={GameScreen}
                        options={{ title: "Гра" }}
                    />
                    <Tab.Screen
                        name="Challenges"
                        component={ChallengesScreen}
                        options={{ title: "Виклики" }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
            <StatusBar style={isDark ? "light" : "dark"} />
        </View>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <GameProvider>
                        <AppContent />
                    </GameProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
