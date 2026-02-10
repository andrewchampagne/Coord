import axios, { AxiosError } from "axios";

export type Habit = {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  created_at: string;
};

export type HabitCompletion = {
  id: number;
  habit_id: number;
  date: string;
  time: string;
  duration: number;
};

export type ConstellationNode = {
  id: number;
  label: string;
  category: string;
  size: number;
  completed: boolean;
};

export type ConstellationEdge = {
  source: number;
  target: number;
  weight: number;
};

export type ConstellationResponse = {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  date: string;
};

export type Insight = {
  type: string;
  text: string;
  confidence: number;
};

const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:8000";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

const handleError = (error: unknown) => {
  const axiosError = error as AxiosError<{ detail?: string }>;
  if (axiosError.response?.data?.detail) {
    throw new Error(axiosError.response.data.detail);
  }
  if (axiosError.message) {
    throw new Error(axiosError.message);
  }
  throw new Error("Something went wrong with the network request.");
};

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await api.get<Habit[]>("/api/habits");
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const createHabit = async (
  name: string,
  category: string,
  difficulty: string
): Promise<Habit> => {
  try {
    const response = await api.post<Habit>("/api/habits", {
      name,
      category,
      difficulty,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const completeHabit = async (
  habitId: number,
  duration: number
): Promise<HabitCompletion> => {
  try {
    const response = await api.post<HabitCompletion>("/api/habits/complete", {
      habit_id: habitId,
      duration,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getTodayCompletions = async (): Promise<HabitCompletion[]> => {
  try {
    const response = await api.get<HabitCompletion[]>("/api/habits/today");
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const getTodayConstellation =
  async (): Promise<ConstellationResponse> => {
    try {
      const response = await api.get<ConstellationResponse>(
        "/api/constellation/today"
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

export const getInsights = async (): Promise<Insight[]> => {
  try {
    const response = await api.get<Insight[]>("/api/insights");
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};
