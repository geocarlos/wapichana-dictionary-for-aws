import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';

const WordList = ({ letter = 'A'}) => {
	const { wordList, setEntry } = useContext(AppContext);
	const selectEntry = entry => {
		setEntry(entry);
	}

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{wordList.map((d, i) => {
					const check = letter.toLowerCase() === d.word[0]?.toLowerCase() || letter.toLowerCase() === d.word.substring(0, 2).toLowerCase();
					return check && <li key={d.word + i}><Link to={`/${i}/${d.word}`} onClick={() => selectEntry(d)} href="#">{d.word}</Link> - {d.definition}</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;