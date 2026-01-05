import axios from "axios";

/**
 * Backend base URL (Render)
 * MUST point to backend service
 */
const API = axios.create({
  baseURL: "https://lean-bulk-app.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/* ---------------- PLAN ---------------- */
export const fetchPlan = () => API.get("/plan");
export const seedDB = () => API.post("/seed");

export const addExerciseToPlan = (day, exercise) =>
  API.post("/plan/add_exercise", { day, exercise });

export const deleteExerciseFromPlan = (day, exerciseName) =>
  API.post("/plan/delete_exercise", { day, exerciseName });

/* ---------------- FOODS ---------------- */
export const fetchFoods = () => API.get("/foods");

export const addFood = (foodData) =>
  API.post("/foods", foodData);

export const deleteFood = (id) =>
  API.post("/foods/delete", { id });

/* ---------------- DAILY LOG ---------------- */
export const fetchDailyLog = () => API.get("/log");

export const addToLog = (item) =>
  API.post("/log", { item });

export const deleteFromLog = (index) =>
  API.post("/log/delete", { index });
