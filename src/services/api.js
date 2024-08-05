import axios from "axios";

const API_URL2 = "http://192.168.79.7:3000";
const API_URL = "https://mobilefinalbackend.onrender.com";

export const searchRestaurants = (term, location, offset = 0) =>
  axios
    .get(`${API_URL}/search`, { params: { term, location, offset } })
    .catch((error) => {
      console.error("API Error:", error.response || error);
      throw error;
    });
