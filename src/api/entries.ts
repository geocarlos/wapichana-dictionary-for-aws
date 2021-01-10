import axios from 'axios';
import Entry from '../model/Entry';
import { API_BASE_SECURE_URL, API_BASE_URL } from './constants';

export const handleFetchEntries = (initialLetter: string) => {
    return axios.get(`${API_BASE_URL}/entries?initialLetter=${initialLetter}`);
};

export const handleCreateEntry = (entry: Entry) => {
    return axios.post(`${API_BASE_SECURE_URL}/entries`, {content: entry});
};