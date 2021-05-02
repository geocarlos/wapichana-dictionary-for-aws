import axios from 'axios';
import Entry from '../model/Entry';
import { API_BASE_SECURE_URL, API_BASE_URL } from './constants';

// Dev
// const data = require('../data/entries-aws.json');

export const handleFetchEntries = (initialLetter: string) => {
    return axios.get(`${API_BASE_URL}/entries?initialLetter=${initialLetter}`);    
    // return Promise.resolve(data.filter((w: Entry) => w.entry.toLocaleLowerCase().startsWith(initialLetter.toLocaleLowerCase())));

};

export const handleFetchEntryById = (entry_id: string) => {
    return axios.get(`${API_BASE_URL}/entries?entry_id=${entry_id}`);
};

export const handleFetchEntry = (entry: string) => {
    return axios.get(`${API_BASE_URL}/entries?entry=${entry}`);
};

export const handleCreateEntry = (entry: Entry) => {
    return axios.post(`${API_BASE_SECURE_URL}/entries`, entry);
};

export const handleDeleteEntry = (entry_id: string) => {
    return axios.delete(`${API_BASE_SECURE_URL}/entries/${entry_id}`);
};