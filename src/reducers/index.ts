import { combineReducers } from 'redux';
import entries from './entryReducer';
import user from './userAuthReducer';
import users from './userReducer';
import loading from './loadingReducer';

const rootReducer = combineReducers({entries, user, users, loading});

export default rootReducer as any;