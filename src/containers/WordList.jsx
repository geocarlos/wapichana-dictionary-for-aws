import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';

const isNotNh = word => {
	return word.substring(0,2).toLowerCase() !== 'nh'; 
}

const WordList = ({ letter = 'A'}) => {
	const { wordList } = useContext(AppContext);

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{Object.keys(wordList).map((d, i) => {
					const check = (letter.toLowerCase() === d[0].toLowerCase() && isNotNh(d)) || letter.toLowerCase() === d.substring(0, 2).toLowerCase();
					return check && <li key={d + i}><Link to={`/${i}/${d}`}>{d}</Link> - {wordList[d].definitions.map(d => d.definition).join('; ')}</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;