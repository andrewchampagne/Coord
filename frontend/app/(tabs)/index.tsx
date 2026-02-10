import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import InsightCard from "../../components/InsightCard";
import {
  getHabits,
  getInsights,
  getTodayCompletions,
  Habit,
  Insight,
} from "../../utils/api";

const HomeScreen = () => {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [habitsData, completionsData, insightsData] = await Promise.all([
        getHabits(),
        getTodayCompletions(),
        getInsights(),
      ]);
      setHabits(habitsData);
      setTodayCount(completionsData.length);
      setInsights(insightsData.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { dateStyle: "full" }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, Stargazer</Text>
        <Text style={styles.subtitle}>{todayLabel}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" />
      ) : (
        <>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Today's Progress</Text>
            <Text style={styles.statsValue}>
              {todayCount} / {habits.length} habits completed
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionPressed,
              ]}
              onPress={() => router.push("/(tabs)/constellation")}
            >
              <Text style={styles.actionText}>View Constellation</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButtonSecondary,
                pressed && styles.actionPressed,
              ]}
              onPress={() => router.push("/(tabs)/habits")}
            >
              <Text style={styles.actionTextSecondary}>Add Habit</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Insights</Text>
            <Pressable onPress={fetchDashboard}>
              <Text style={styles.refresh}>Refresh</Text>
            </Pressable>
          </View>

          {insights.length === 0 ? (
            <Text style={styles.empty}>No insights yet. Keep logging!</Text>
          ) : (
            insights.map((insight, index) => (
              <InsightCard key={`${insight.type}-${index}`} insight={insight} />
            ))
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#b5b9d6",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#141a3a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsLabel: {
    color: "#b5b9d6",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsValue: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4ECDC4",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionText: {
    color: "#0a0e27",
    fontWeight: "700",
  },
  actionTextSecondary: {
    color: "#4ECDC4",
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  refresh: {
    color: "#4ECDC4",
    fontWeight: "600",
  },
  empty: {
    color: "#b5b9d6",
    marginTop: 12,
  },
});

export default HomeScreen;
