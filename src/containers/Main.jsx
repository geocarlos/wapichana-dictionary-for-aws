import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';

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
			{pages[page]}
		</main>
	)
}

export default Main;