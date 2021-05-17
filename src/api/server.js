import axios from 'axios';

const server = axios.create({
  baseURL: (process.env.NODE_ENV === 'production') ? "http://api.chaoprayanovato.com/" : "http://localhost:8000/",
  timeout: 5000,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default server;
