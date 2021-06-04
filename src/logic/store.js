import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import Reducers from './reducers/index';

const store = createStore(
  Reducers,
  {},
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
