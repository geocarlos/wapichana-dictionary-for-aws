import { ICreateEntry, IDeleteEntry, IFetchEntries } from "./IActions";
import keys from './ActionTypeKeys';
import Entry from "../model/Entry";
import { handleCreateEntry, handleFetchEntries } from "../api/entries";

export const fetchEntries = (initialLetter: string): IFetchEntries => ({
    type: keys.FETCH_ENTRIES,
    payload: handleFetchEntries(initialLetter)
});

export const createEntry = (entry: Entry): ICreateEntry => ({
    type: keys.CREATE_ENTRY,
    payload: handleCreateEntry(entry)
});

export const deleteEntry = (entry: Entry): IDeleteEntry => ({
    type: keys.DELETE_ENTRY,
    payload: Promise.resolve(entry)
})