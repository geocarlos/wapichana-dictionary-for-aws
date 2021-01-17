import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import User from "../model/User";
import initialState from '../store/initialState';

const user: Reducer<User, ActionTypes> = (state = initialState.user, action: ActionTypes): User => {
    switch (action.type) {
        case ActionTypeKeys.SIGN_IN_RESOLVED:
            return action.payload;
        case ActionTypeKeys.SIGN_IN_REJECTED:
        case ActionTypeKeys.SIGN_OUT_RESOLVED:
            return {
                ...state,
                isLoggedIn: false
            };
        default:
            return state;
    }
}

export default user;