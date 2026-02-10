import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import HabitCard from "../../components/HabitCard";
import { completeHabit, createHabit, getHabits, Habit } from "../../utils/api";

const HabitsScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState("");

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) {
      Alert.alert("Missing info", "Please enter a habit name.");
      return;
    }
    try {
      const created = await createHabit(newHabitName.trim(), "other", "medium");
      setHabits((prev) => [created, ...prev]);
      setNewHabitName("");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleCompleteHabit = async (habitId: number) => {
    try {
      await completeHabit(habitId, 10);
      Alert.alert("Nice work!", "Habit completed for today.");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <Text style={styles.stardust}>Stardust Balance: 120 ✨</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="New habit name"
          placeholderTextColor="#6f73a2"
          value={newHabitName}
          onChangeText={setNewHabitName}
        />
        <Text style={styles.addButton} onPress={handleCreateHabit}>
          Add
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HabitCard habit={item} onComplete={() => handleCompleteHabit(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No habits yet. Add your first one!</Text>
          }
        />
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
    fontSize: 24,
    fontWeight: "700",
  },
  stardust: {
    color: "#b5b9d6",
    marginTop: 4,
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#141a3a",
    color: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4ECDC4",
    color: "#0a0e27",
    fontWeight: "700",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    color: "#b5b9d6",
    textAlign: "center",
    marginTop: 40,
  },
});

export default HabitsScreen;
