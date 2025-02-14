import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:8002/api',
    baseURL: 'https://mystoreapi-3p5y.onrender.com/api',
    // withCredentials: true, 
  });

export default axiosInstance;