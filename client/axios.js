import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8002/api',
    // withCredentials: true, 
  });

export default axiosInstance;
