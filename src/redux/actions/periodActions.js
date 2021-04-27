import server from '../../api/server';
import { GET_ALL_PAY_PERIODS } from './types';

export const getPayPeriods = () => async (dispatch) => {
  await server
    .get('pay/periods')
    .then((response) => {
      console.log(response.data);

      dispatch({ type: GET_ALL_PAY_PERIODS, payload: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentPeriod = () => async (dispatch) => {};
