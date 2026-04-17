import React from "react";
import { View, Text } from "react-native";
import { Challenge } from "../context/GameContext";

interface Props {
  challenge: Challenge;
  isDark: boolean;
}

export default function ChallengeCard({ challenge, isDark }: Props) {
  const { label, progress, target } = challenge;
  const done = progress >= target;
  const pct = Math.min((progress / target) * 100, 100);

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            flex: 1,
            color: done
              ? isDark
                ? "#34d399"
                : "#16a34a"
              : isDark
              ? "#e5e7eb"
              : "#1f2937",
          }}
        >
          {done ? "✓ " : ""}
          {label}
        </Text>
        <Text style={{ fontSize: 14, color: isDark ? "#9ca3af" : "#6b7280" }}>
          {Math.min(progress, target)}/{target}
        </Text>
      </View>

      <View
        style={{
          height: 10,
          borderRadius: 9999,
          overflow: "hidden",
          backgroundColor: isDark ? "#374151" : "#e5e7eb",
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            backgroundColor: done ? "#22c55e" : "#6366f1",
            height: "100%",
            borderRadius: 9999,
          }}
        />
      </View>
    </View>
  );
}
