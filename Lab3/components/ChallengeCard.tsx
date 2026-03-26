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
      className="mx-4 mb-3 rounded-2xl p-4"
      style={{
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-base font-semibold flex-1"
          style={{
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
        <Text
          className="text-sm"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          {Math.min(progress, target)}/{target}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        className="h-2.5 rounded-full overflow-hidden"
        style={{ backgroundColor: isDark ? "#374151" : "#e5e7eb" }}
      >
        <View
          style={{
            width: `${pct}%`,
            backgroundColor: done ? "#22c55e" : "#6366f1",
          }}
          className="h-full rounded-full"
        />
      </View>
    </View>
  );
}
