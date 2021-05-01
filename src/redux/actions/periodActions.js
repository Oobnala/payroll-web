import server from '../../api/server';
import { GET_ALL_PAY_PERIODS, GET_DATES } from './types';

export const getPayPeriods = () => async (dispatch) => {
  await server
    .get('pay/periods')
    .then((response) => {
      dispatch({ type: GET_ALL_PAY_PERIODS, payload: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDates = () => async (dispatch) => {
  await server
    .get('periods')
    .then((response) => {
      dispatch({ type: GET_DATES, payload: response.data });
    })
    .catch((err) => {});
};
