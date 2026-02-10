import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

import {
  ConstellationResponse,
  getTodayConstellation,
} from "../../utils/api";

const CATEGORY_COLORS: Record<string, string> = {
  health: "#4ECDC4",
  work: "#FFE66D",
  social: "#FF6B6B",
  creative: "#95E1D3",
  other: "#C7CEEA",
};

const ConstellationScreen = () => {
  const [constellation, setConstellation] =
    useState<ConstellationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConstellation = async () => {
    try {
      setLoading(true);
      const data = await getTodayConstellation();
      setConstellation(data);
    } catch (error) {
      setConstellation({ nodes: [], edges: [], date: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstellation();
  }, []);

  const layout = useMemo(() => {
    const nodes = constellation?.nodes ?? [];
    const size = Math.min(
      Dimensions.get("window").width,
      Dimensions.get("window").height
    );
    const radius = size * 0.32;
    const centerX = size / 2;
    const centerY = size / 2;

    return nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / Math.max(nodes.length, 1);
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [constellation]);

  const edgeLines = useMemo(() => {
    if (!constellation) return [];
    const positionMap = new Map(layout.map((node) => [node.id, node]));
    return constellation.edges.map((edge) => ({
      ...edge,
      sourceNode: positionMap.get(edge.source),
      targetNode: positionMap.get(edge.target),
    }));
  }, [constellation, layout]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Constellation</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" />
      ) : constellation && constellation.nodes.length > 0 ? (
        <View style={styles.canvas}>
          <Svg width="100%" height="100%">
            {edgeLines.map(
              (edge, index) =>
                edge.sourceNode &&
                edge.targetNode && (
                  <Line
                    key={`edge-${index}`}
                    x1={edge.sourceNode.x}
                    y1={edge.sourceNode.y}
                    x2={edge.targetNode.x}
                    y2={edge.targetNode.y}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2 * edge.weight}
                  />
                )
            )}
            {layout.map((node) => {
              const color =
                CATEGORY_COLORS[node.category?.toLowerCase()] ||
                CATEGORY_COLORS.other;
              return (
                <React.Fragment key={`node-${node.id}`}>
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={Math.max(10, node.size / 4)}
                    fill={color}
                  />
                  <SvgText
                    x={node.x}
                    y={node.y + 20}
                    fill="#ffffff"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {node.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      ) : (
        <Text style={styles.empty}>
          Complete some habits to form your constellation!
        </Text>
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
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  canvas: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#121633",
    padding: 12,
  },
  empty: {
    color: "#b5b9d6",
    marginTop: 40,
    textAlign: "center",
  },
});

export default ConstellationScreen;
