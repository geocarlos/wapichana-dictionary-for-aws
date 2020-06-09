import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../context/app-context';

const Word = () => {
	const history = useHistory();
	const { entry, setEntry, wordList } = useContext(AppContext);

	const { wordId } = useParams();

	useEffect(() => {
		if (!entry.word) {
			setEntry(wordList[wordId]);
		}
	})

	return (
		<>
			<h1>{entry.word}</h1>
			<h3>{entry.definition}</h3>
			<button onClick={() => history.push('/')}>Go Back</button>
		</>
	)
}

export default Word;