import axios from "axios";

const API_URL = "http://192.168.79.7:3000";

export const searchRestaurants = (term, location, offset = 0) =>
  axios
    .get(`${API_URL}/search`, { params: { term, location, offset } })
    .catch((error) => {
      console.error("API Error:", error.response || error);
      throw error;
    });

export const login = (username, password) =>
  axios.post(`${API_URL}/login`, { username, password });

export const register = (username, password) =>
  axios.post(`${API_URL}/register`, { username, password });

export const getFavorites = (token) =>
  axios.get(`${API_URL}/favorites`, { headers: { Authorization: token } });
