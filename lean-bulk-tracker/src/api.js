import axios from "axios";

// CHANGE THIS TO YOUR ACTUAL BACKEND URL IF DIFFERENT
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Or your Render URL
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

/* ---------------- DAILY LOG (FOOD & WORKOUTS) ---------------- */
export const fetchDailyLog = () => API.get("/log");

// Food
export const addToLog = (item) => API.post("/log/food", { item });
export const deleteFromLog = (index) => API.post("/log/food/delete", { index });

// Exercises
export const toggleExerciseLog = (exerciseName, dayLabel) => 
  API.post("/log/exercise", { exerciseName, dayLabel });

/* ---------------- HISTORY ---------------- */
export const fetchHistory = () => API.get("/history");