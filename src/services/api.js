import axios from "axios";

const API_URL = "http://192.168.79.14:3000";
const API_URL2 = "https://mobilefinalbackend.onrender.com";

export const searchRestaurants = (term, location, offset = 0) =>
  axios
    .get(`${API_URL}/search`, { params: { term, location, offset } })
    .catch((error) => {
      console.error("API Error:", error.response || error);
      throw error;
    });
