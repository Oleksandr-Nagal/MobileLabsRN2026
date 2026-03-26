import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import ScoreDisplay from "../components/ScoreDisplay";
import ClickerObject from "../components/ClickerObject";
import { Ionicons } from "@expo/vector-icons";

export default function GameScreen() {
  const { isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? "#111827" : "#f9fafb",
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Text
          className="text-xl font-bold"
          style={{ color: isDark ? "#ffffff" : "#1f2937" }}
        >
          Клікер Гра
        </Text>
        <Pressable onPress={toggleTheme} className="p-2">
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={isDark ? "#fbbf24" : "#6366f1"}
          />
        </Pressable>
      </View>

      <ScoreDisplay />

      {/* Hint */}
      <View className="px-6 mb-4">
        <Text
          className="text-center text-xs"
          style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
        >
          Тап · Подвійний тап · Довге натискання · Перетягування · Свайп · Щипок
        </Text>
      </View>

      {/* Play area */}
      <View className="flex-1 items-center justify-center">
        <ClickerObject />
      </View>
    </View>
  );
}
