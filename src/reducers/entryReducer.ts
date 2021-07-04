import { Reducer } from "redux";
import ActionTypeKeys from "../actions/ActionTypeKeys";
import ActionTypes from "../actions/ActionTypes";
import Entry from "../model/Entry";
import initialState from '../store/initialState';

const entries: Reducer<Array<Entry[]>, ActionTypes> = (state = initialState.entries, action: ActionTypes): Array<Entry[]> => {
    switch (action.type) {
        case ActionTypeKeys.FETCH_ENTRIES_RESOLVED:
            const words = action.payload.data.sort((a: Entry[], b: Entry[]) => a[0].entry_id.toLowerCase() > b[0].entry_id.toLowerCase() ? 1 : a[0].entry_id.toLowerCase() < b[0].entry_id.toLowerCase() ? -1 : 0);
            return words.map((w: any) => w.sort((a: Entry, b: Entry) => a.entry_id.toLowerCase() > b.entry_id.toLowerCase() ? 1 : a.entry_id.toLowerCase() < b.entry_id.toLowerCase() ? -1 : 0));
        case ActionTypeKeys.CREATE_ENTRY_RESOLVED:
            const newEntry = action.payload.data;
            const index = state.map(e => {
                return e[0].entry;
            }).indexOf(newEntry.entry);
            const newState = state;
            if (index >= 0) {
                newState[index] = [newEntry];
            } else {
                newState.push([newEntry]);
                newState.sort((a: Entry[], b: Entry[]) => a[0].entry_id.toLowerCase() > b[0].entry_id.toLowerCase() ? 1 : a[0].entry_id.toLowerCase() < b[0].entry_id.toLowerCase() ? -1 : 0);
            }
            return newState;

        default:
            return state;
    }
}

export default entries;