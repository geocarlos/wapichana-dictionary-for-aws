import React from 'react';
import WordList from './WordList';
import Word from './Word';

const Main = () => {
	// We will have routes here.
	// We may use React Router

	return (
		<>
			<h1>Dicionário Wapichana</h1>
			<WordList />
			<Word />
		</>
	)
}

export default Main;