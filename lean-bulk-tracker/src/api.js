import axios from 'axios';

// REPLACE THIS URL with the one you got from Render in Phase 3
// It must end with /api
const API_URL = 'https://lean-bulk-app.onrender.com/api'; 

export const fetchPlan = () => axios.get(`${API_URL}/plan`);
export const seedDB = () => axios.post(`${API_URL}/seed`);

export const addExerciseToPlan = (day, exercise) => axios.post(`${API_URL}/plan/add_exercise`, { day, exercise });
export const deleteExerciseFromPlan = (day, exerciseName) => axios.post(`${API_URL}/plan/delete_exercise`, { day, exerciseName });

export const fetchFoods = () => axios.get(`${API_URL}/foods`);
export const addFood = (foodData) => axios.post(`${API_URL}/foods`, foodData);
export const deleteFood = (id) => axios.post(`${API_URL}/foods/delete`, { id });

export const fetchDailyLog = () => axios.get(`${API_URL}/log`);
export const addToLog = (item) => axios.post(`${API_URL}/log`, { item });
export const deleteFromLog = (index) => axios.post(`${API_URL}/log/delete`, { index });