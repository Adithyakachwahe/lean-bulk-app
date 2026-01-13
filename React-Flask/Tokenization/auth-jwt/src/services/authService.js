import apiClient from "../utils/api-client";

export function register(data) {
  return apiClient.post("/register", data);
}

export function login(data) {
  return apiClient.post("/login", data);
}
