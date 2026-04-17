import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import ScoreDisplay from "../components/ScoreDisplay";
import ClickerObject from "../components/ClickerObject";

export default function GameScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#111827" : "#f9fafb",
        paddingTop: insets.top,
      }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: isDark ? "#ffffff" : "#1f2937",
          }}
        >
          Клікер Гра
        </Text>
      </View>

      <ScoreDisplay />

      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            color: isDark ? "#6b7280" : "#9ca3af",
          }}
        >
          Тап · Подвійний тап · Довге натискання · Перетягування · Свайп · Щипок
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ClickerObject />
      </View>
    </View>
  );
}
