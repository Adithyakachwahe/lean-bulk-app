import axios from 'axios';

// CHANGE THIS: If you want to access on phone, change 'localhost' 
// to your PC's IP address (e.g., '192.168.1.5')
const API_URL = 'http://localhost:5000/api'; 

export const fetchPlan = () => axios.get(`${API_URL}/plan`);
export const seedDB = () => axios.post(`${API_URL}/seed`);

// Workout
export const addExerciseToPlan = (day, exercise) => axios.post(`${API_URL}/plan/add_exercise`, { day, exercise });
export const deleteExerciseFromPlan = (day, exerciseName) => axios.post(`${API_URL}/plan/delete_exercise`, { day, exerciseName });

// Foods
export const fetchFoods = () => axios.get(`${API_URL}/foods`);
export const addFood = (foodData) => axios.post(`${API_URL}/foods`, foodData);
export const deleteFood = (id) => axios.post(`${API_URL}/foods/delete`, { id });

// Log
export const fetchDailyLog = () => axios.get(`${API_URL}/log`);
export const addToLog = (item) => axios.post(`${API_URL}/log`, { item });
export const deleteFromLog = (index) => axios.post(`${API_URL}/log/delete`, { index });