import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import User from "../model/User";
import initialState from '../store/initialState';

const user: Reducer<User | null, ActionTypes> = (state = initialState.user, action: ActionTypes): User | null => {
    switch (action.type) {
        case ActionTypeKeys.SIGN_IN_RESOLVED:
            return action.payload;
        default:
            return state;
    }
}

export default user;