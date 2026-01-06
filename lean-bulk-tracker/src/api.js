import axios from "axios";

// CHANGE THIS TO YOUR ACTUAL BACKEND URL
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
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
export const addFood = (foodData) => API.post("/foods", foodData);
export const deleteFood = (id) => API.post("/foods/delete", { id });

/* ---------------- DAILY LOG ---------------- */
export const fetchDailyLog = () => API.get("/log");

// Food
export const addToLog = (item) => API.post("/log/food", { item });
export const deleteFromLog = (index) => API.post("/log/food/delete", { index });

// Water & Weight (NEW)
export const updateWater = (amount) => API.post("/log/water", { amount });
export const updateWeight = (weight) => API.post("/log/weight", { weight });

// Exercises
export const toggleExerciseLog = (exerciseName, dayLabel) => 
  API.post("/log/exercise", { exerciseName, dayLabel });

/* ---------------- HISTORY ---------------- */
export const fetchHistory = () => API.get("/history");