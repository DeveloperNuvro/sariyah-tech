import axios from 'axios';


// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;