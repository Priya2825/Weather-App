import axios from 'axios';

const API_KEY = '24f40166e842079cad21bf954642b936';

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: API_KEY, // Append the API key to every request
  },
});

export default api;