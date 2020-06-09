import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Main = () => {
	// We will have routes here.
	// We may use React Router
	const [letter, setLetter] = useState('A');
	const [entry, setEntry] = useState(null);
	const [page, setPage] = useState(0); // We may replace this with React Router

	// Supposed to be replaced by Router
	const pages = [
		<WordList letter={letter} setEntry={setEntry} setPage={setPage} />,
		<Word entry={entry} setPage={setPage} />
	]

	return (
		<main>
			<Header />
			<LetterNav setLetter={setLetter} />
			<Router>
				<Switch>
				<Route exact path="/">
					<WordList letter={letter} setEntry={setEntry} />
				</Route>
				<Route path="/entry/:word">
					<Word entry={entry} />
				</Route>
				</Switch>
			</Router>
		</main>
	)
}

export default Main;