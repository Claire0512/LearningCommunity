import axios from 'axios';

const BACKEND_URL: string = 'http://localhost:3000/';

const api = axios.create({
	baseURL: BACKEND_URL,
});

export default api;