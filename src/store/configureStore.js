import { createStore, combineReducers } from 'redux';
import profileReducer from '../reducers/profile';
import tasksReducer from '../reducers/tasks';
import itemsReducer from '../reducers/items';
import jobsReducer from '../reducers/jobs';
import synthsReducer from '../reducers/synths';

export default () => createStore(
  combineReducers({
    profile: profileReducer,
    tasks: tasksReducer,
    items: itemsReducer,
    jobs: jobsReducer,
    synths: synthsReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
