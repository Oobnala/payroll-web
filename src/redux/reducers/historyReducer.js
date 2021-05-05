import { GET_HISTORY } from '../actions/types';

const INITIAL_STATE = {
  history: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_HISTORY:
      return {
        history: action.payload,
      };
    default:
      return state;
  }
};
