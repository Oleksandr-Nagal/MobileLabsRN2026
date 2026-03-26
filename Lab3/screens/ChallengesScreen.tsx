import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame, getChallenges } from "../context/GameContext";
import { useTheme } from "../context/ThemeContext";
import ChallengeCard from "../components/ChallengeCard";
import { Ionicons } from "@expo/vector-icons";

export default function ChallengesScreen() {
  const { state } = useGame();
  const { isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const challenges = getChallenges(state);
  const completed = challenges.filter((c) => c.progress >= c.target).length;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? "#111827" : "#f9fafb",
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <Text
          className="text-xl font-bold"
          style={{ color: isDark ? "#ffffff" : "#1f2937" }}
        >
          Виклики
        </Text>
        <Pressable onPress={toggleTheme} className="p-2">
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={isDark ? "#fbbf24" : "#6366f1"}
          />
        </Pressable>
      </View>

      {/* Progress summary */}
      <View className="mx-4 mb-4 rounded-2xl p-4" style={{ backgroundColor: "#6366f1" }}>
        <Text className="text-center text-lg font-bold" style={{ color: "#ffffff" }}>
          {completed} / {challenges.length} викликів виконано
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} isDark={isDark} />
        ))}
      </ScrollView>
    </View>
  );
}
