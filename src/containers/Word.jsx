import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../context/app-context';

const Word = () => {
	const history = useHistory();
	const { wordList } = useContext(AppContext);

	const { wordId } = useParams();

	return (
		<>
			<h1>{wordList[wordId].word}</h1>
			<h3>{wordList[wordId].definition}</h3>
			<button onClick={() => history.push('/')}>Go Back</button>
		</>
	)
}

export default Word;