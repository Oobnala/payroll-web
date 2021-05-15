import axios from 'axios';

const server = axios.create({
  baseURL: (process.env.NODE_ENV === 'production') ? "http://api.chaoprayanovato.com/" : "localhost:8080/",
  timeout: 3000,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default server;
