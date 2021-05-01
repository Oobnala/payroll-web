import { GET_ALL_PAY_PERIODS, GET_DATES } from '../actions/types';

const INITIAL_STATE = {
  periods: {},
  dates: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_PAY_PERIODS:
      return {
        ...state,
        periods: action.payload,
      };
    case GET_DATES:
      return {
        ...state,
        dates: action.payload,
      };
    default:
      return state;
  }
};
