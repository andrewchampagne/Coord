import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Insight } from "../utils/api";

type InsightCardProps = {
  insight: Insight;
};

const TYPE_STYLES: Record<
  string,
  { icon: string; color: string; background: string }
> = {
  correlation: { icon: "🔗", color: "#4ECDC4", background: "rgba(78,205,196,0.15)" },
  achievement: { icon: "🏆", color: "#FFE66D", background: "rgba(255,230,109,0.15)" },
  suggestion: { icon: "💡", color: "#FF6B6B", background: "rgba(255,107,107,0.15)" },
};

const InsightCard = ({ insight }: InsightCardProps) => {
  const typeStyle = TYPE_STYLES[insight.type] || TYPE_STYLES.suggestion;

  return (
    <View style={[styles.card, { borderColor: typeStyle.color }]}>
      <View style={[styles.iconWrap, { backgroundColor: typeStyle.background }]}>
        <Text style={styles.icon}>{typeStyle.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>{insight.text}</Text>
        <Text style={styles.confidence}>
          Confidence: {(insight.confidence * 100).toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  body: {
    flex: 1,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 6,
  },
  confidence: {
    color: "#b5b9d6",
    fontSize: 12,
  },
});

export default InsightCard;
