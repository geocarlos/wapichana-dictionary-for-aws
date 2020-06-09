import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';

import wordList from '../data/data.json';

const Main = () => {
	const [letter, setLetter] = useState('A');
	const [entry, setEntry] = useState({});

	return (
		<main>
			<Header />
			<AppContext.Provider value={{ wordList, entry, setEntry }}>
				<Router>
					<LetterNav setLetter={setLetter} />
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route path="/:wordId/:word">
							<Word />
						</Route>
					</Switch>
				</Router>
			</AppContext.Provider>
		</main>
	)
}

export default Main;