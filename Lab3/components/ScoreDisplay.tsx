import React from "react";
import { View, Text } from "react-native";
import { useGame } from "../context/GameContext";
import { useTheme } from "../context/ThemeContext";

export default function ScoreDisplay() {
  const { state } = useGame();
  const { isDark } = useTheme();

  return (
    <View style={{ alignItems: "center", paddingVertical: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "500",
          color: isDark ? "#9ca3af" : "#6b7280",
        }}
      >
        Рахунок
      </Text>
      <Text
        style={{
          fontSize: 60,
          fontWeight: "700",
          color: isDark ? "#818cf8" : "#6366f1",
        }}
      >
        {state.score}
      </Text>
    </View>
  );
}
