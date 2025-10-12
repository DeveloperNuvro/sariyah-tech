import axios from 'axios';


// Create an Axios instance
const api = axios.create({
  baseURL: 'https://whale-app-upwat.ondigitalocean.app/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;