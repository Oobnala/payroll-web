import server from '../../api/server';
import { GET_ALL_PAY_PERIODS, GET_DATES, SUBMIT, LOCK, UNLOCK } from './types';

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
    .catch((err) => {
      console.log(err);
    });
};

export const submit = (employees) => async (dispatch) => {
  await server
    .post('submit', { employees: employees }, { timeout: 20000 })
    .then((response) => {
      console.log(response);
      dispatch({ type: SUBMIT });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const lock = (employees) => async (dispatch) => {
  await server
    .post('lock', { employees: employees }, { timeout: 20000 })
    .then((response) => {
      console.log(response);
      dispatch({ type: LOCK });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const unlock = (id, periodStart) => async (dispatch) => {
  await server.delete('unlock', {
    params: {
      id: id,
      periodStart: periodStart
    },
  });
};