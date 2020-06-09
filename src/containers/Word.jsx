import React from 'react';
import { useHistory } from 'react-router-dom';

const Word = ({ entry }) => {
	// This component should receive a word as prop.
	const history = useHistory();

	return (
		<>
			<h1>{entry.word}</h1>
			<h3>{entry.definition}</h3>
			<button onClick={() => history.push('/')}>Go Back</button>
		</>
	)
}

export default Word;