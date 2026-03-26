import React from "react";
import { View, Text } from "react-native";
import { useGame } from "../context/GameContext";
import { useTheme } from "../context/ThemeContext";

export default function ScoreDisplay() {
  const { state } = useGame();
  const { isDark } = useTheme();

  return (
    <View className="items-center py-6">
      <Text
        className="text-lg font-medium"
        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
      >
        Рахунок
      </Text>
      <Text
        className="text-6xl font-bold"
        style={{ color: isDark ? "#818cf8" : "#6366f1" }}
      >
        {state.score}
      </Text>
    </View>
  );
}
