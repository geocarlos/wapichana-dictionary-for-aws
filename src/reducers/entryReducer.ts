import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import Entry from "../model/Entry";
import initialState from '../store/initialState';

const entries: Reducer<Array<Entry>, ActionTypes> = (state = initialState.entries, action: ActionTypes): Array<Entry> => {
    switch (action.type) {
        case ActionTypeKeys.FETCH_ENTRIES_RESOLVED:
            return action.payload.data.sort(({entry_id: a}: Entry, {entry_id: b}: Entry) => a > b ? 1 : a < b ? -1 : 0);
        case ActionTypeKeys.CREATE_ENTRY_RESOLVED:
            const newEntry = action.payload.data;
            const index = state.map(e => e.entry_id).indexOf(newEntry.entry_id);
            const newState = state;
            if (index >= 0) {
                newState[index] = newEntry;
            } else {
                newState.push(newEntry);
                newState.sort(({entry_id: a}: Entry, {entry_id: b}: Entry) => a > b ? 1 : a < b ? -1 : 0);
            }
            return newState;

        default:
            return state;
    }
}

export default entries;