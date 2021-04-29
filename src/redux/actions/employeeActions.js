import server from '../../api/server';
import { GET_EMPLOYEES, ADD_EMPLOYEE, EDIT_EMPLOYEE } from './types';

export const getEmployees = () => async (dispatch) => {
  await server
    .get('/employees')
    .then((response) => {
      dispatch({ type: GET_EMPLOYEES, payload: response.data.employees });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addEmployee = (employeeProps) => async (dispatch) => {
  await server
    .post('/add/employee', employeeProps)
    .then(() => {
      dispatch({ type: ADD_EMPLOYEE });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const editEmployee = (employeeProps) => async (dispatch) => {
  await server
    .post('/edit/employee', employeeProps)
    .then(() => {
      dispatch({ type: EDIT_EMPLOYEE });
    })
    .catch((err) => {
      console.log(err);
    });
};
