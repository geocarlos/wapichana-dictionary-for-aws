import React from 'react';

const Word = ({ entry, setPage }) => {
	// This component should receive a word as prop.

	return (
		<>
			<h1>{entry.word}</h1>
			<h3>{entry.definition}</h3>
			<button onClick={() => setPage(0)}>Go Back</button>
		</>
	)
}

export default Word;