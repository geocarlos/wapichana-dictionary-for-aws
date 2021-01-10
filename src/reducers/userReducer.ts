import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import User from "../model/User";
import initialState from '../store/initialState';

const users: Reducer<Array<User> | null, ActionTypes> = (state = initialState.users, action: ActionTypes): Array<User> | null => {
    switch (action.type) {
        case ActionTypeKeys.FETCH_USERS_RESOLVED:
            return action.payload;
        default:
            return state;
    }
}

export default users;