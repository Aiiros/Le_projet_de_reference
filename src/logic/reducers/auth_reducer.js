import produce from 'immer';
import ACTION_TYPES from '../action/action_types';

const INITIAL_STATE = {
  user: null
};

const AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.Auth.setUser:
      return produce(state, (draft) => {
        if (action.payload) {
          const tempDraft = draft;
          tempDraft.user = action.payload.user;
        }
      });
    default:
      return state;
  }
};

export default AuthReducer;
