import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Habit } from "../utils/api";

type HabitCardProps = {
  habit: Habit;
  onComplete: () => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  health: "#4ECDC4",
  work: "#FFE66D",
  social: "#FF6B6B",
  creative: "#95E1D3",
  other: "#C7CEEA",
};

const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
  const color =
    CATEGORY_COLORS[habit.category?.toLowerCase()] || CATEGORY_COLORS.other;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.category}>{habit.category}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onComplete}
      >
        <Text style={styles.buttonText}>Complete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141a3a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  category: {
    color: "#b5b9d6",
    marginTop: 4,
    textTransform: "capitalize",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#4ECDC4",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#0a0e27",
    fontWeight: "700",
  },
});

export default HabitCard;
