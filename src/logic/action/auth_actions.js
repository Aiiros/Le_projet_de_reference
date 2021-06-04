import ACTION_TYPES from './action_types';

const setUser = (user) => ({
  payload: { user },
  type: ACTION_TYPES.Auth.setUser
});

const AuthActions = {
  setUser
};

export default AuthActions;
