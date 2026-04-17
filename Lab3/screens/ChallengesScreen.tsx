import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame, getChallenges } from "../context/GameContext";
import { useTheme } from "../context/ThemeContext";
import ChallengeCard from "../components/ChallengeCard";

export default function ChallengesScreen() {
  const { state } = useGame();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const challenges = getChallenges(state);
  const completed = challenges.filter((c) => c.progress >= c.target).length;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#111827" : "#f9fafb",
        paddingTop: insets.top,
      }}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: isDark ? "#ffffff" : "#1f2937",
          }}
        >
          Виклики
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 16,
          padding: 16,
          backgroundColor: "#6366f1",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {completed} / {challenges.length} викликів виконано
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} isDark={isDark} />
        ))}
      </ScrollView>
    </View>
  );
}
