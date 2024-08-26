import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/food'
});

/*
console.log('Configuración de Axios:', {
 baseURL: instance.defaults.baseURL,
  headers: instance.defaults.headers,
});
*/

export default instance;