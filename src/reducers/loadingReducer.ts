import { Reducer } from "redux";
import ActionTypes from "../actions/ActionTypes";
import initialState from '../store/initialState';

const user: Reducer<boolean, ActionTypes> = (state = initialState.loading, action: ActionTypes): boolean => {
    if (action.type.endsWith('_PENDING')) {
        return true;
    } else if (action.type.endsWith('_RESOLVED') || action.type.endsWith('_REJECTED')) {
        return false;
    }

    return state;
}

export default user;