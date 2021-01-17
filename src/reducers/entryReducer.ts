import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import Entry from "../model/Entry";
import initialState from '../store/initialState';

const entries: Reducer<Array<Entry>, ActionTypes> = (state = initialState.entries, action: ActionTypes): Array<Entry> => {
    switch (action.type) {
        case ActionTypeKeys.FETCH_ENTRIES_RESOLVED:
            return action.payload.data;
        default:
            return state;
    }
}

export default entries;