import React, { useEffect, useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';

import wordList from '../data/entries.json';
import FileUpload from '../components/FileUpload';
import { useDispatch } from 'react-redux';
import { fetchEntries } from '../actions/EntryActions';
const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/';

const Main = () => {
	const [letter, setLetter] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		if (letter) {
			dispatch<any>(fetchEntries(letter))
				.then((data: any) => console.log('DATA:', data))
				.catch((error: Error) => console.log(error));
		}
	}, [letter])

	return (
		<>
			<AppContext.Provider value={{ wordList, audioUrl }}>
				<Router>
					<Header />
					<LetterNav setLetter={setLetter} />
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route exact path="/fileupload">
							<FileUpload />
						</Route>
						<Route path="/:entry_id">
							<Word setLetter={setLetter} />
						</Route>
					</Switch>
				</Router>
			</AppContext.Provider>
		</>
	)
}

export default Main;