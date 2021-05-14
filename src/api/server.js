import axios from 'axios';

const server = axios.create({
  baseURL: "http://api.chaoprayanovato.com/",
  timeout: 3000,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default server;
