import { GET_ALL_PAY_PERIODS } from '../actions/types';

const INITIAL_STATE = {
  periods: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_PAY_PERIODS:
      return {
        periods: action.payload,
      };

    default:
      return state;
  }
};
