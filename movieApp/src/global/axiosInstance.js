import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://meta-phim-server.onrender.com",
  timeout: 30000,
});

export default axiosInstance;
