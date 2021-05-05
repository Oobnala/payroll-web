import server from '../../api/server';
import { GET_HISTORY } from './types';

export const getHistory = (id) => async (dispatch) => {
  await server
    .get('/history', { params: { id: id } })
    .then((response) => {
      dispatch({ type: GET_HISTORY, payload: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
};
