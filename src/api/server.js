import axios from 'axios';

const server = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 3000,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default server;
