import { GET_EMPLOYEES } from '.././actions/types';

const INITIAL_STATE = {
  employees: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEES:
      return {
        employees: action.payload,
      };
    default:
      return state;
  }
};
