import { combineReducers,createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import user from './utilities/user'

const rootReducer = combineReducers({user});


const store = createStore(rootReducer,applyMiddleware(thunk));

export default store;