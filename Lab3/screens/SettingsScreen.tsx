import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

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
          Налаштування
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 8,
            paddingHorizontal: 8,
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          Зовнішній вигляд
        </Text>

        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
          }}
        >
          <Pressable
            onPress={toggleTheme}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  backgroundColor: isDark ? "#374151" : "#eef2ff",
                }}
              >
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={20}
                  color={isDark ? "#fbbf24" : "#6366f1"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#1f2937",
                  }}
                >
                  Темна тема
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {isDark ? "Увімкнено" : "Вимкнено"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#d1d5db", true: "#6366f1" }}
              thumbColor="#ffffff"
            />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 8,
            paddingHorizontal: 8,
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          Про застосунок
        </Text>

        <View
          style={{
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontSize: 16, color: isDark ? "#ffffff" : "#1f2937" }}
            >
              Версія
            </Text>
            <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>1.0.0</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
