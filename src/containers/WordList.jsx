import React from 'react';
import data from '../data/data.json';
import { Link } from 'react-router-dom';

const WordList = ({ letter = 'A', setEntry}) => {
	// This component should either receive the list of words
	// as props or get it from the global state, considering
	// we may use Redux to manage the global state.
	const selectEntry = entry => {
		setEntry(entry);
	}

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{data.map((d, i) => {
					const check = letter.toLowerCase() === d.word[0]?.toLowerCase() || letter.toLowerCase() === d.word.substring(0, 2).toLowerCase();
					return check && <li key={d.word + i}><Link to={`/entry/${d.word}`} onClick={() => selectEntry(d)} href="#">{d.word}</Link> - {d.definition}</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;