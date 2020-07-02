import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';

const isNotNh = word => {
	return word.substring(0,2).toLowerCase() !== 'nh'; 
}

const WordList = ({ letter = 'A'}) => {
	const { wordList, audioList, deleteAudio, moveAudio } = useContext(AppContext);
	
	const [audio, setAudio] = useState();

	const play = url => {
		console.log(url)
		setAudio(new Audio(url));
	}

	const stop = () => {
		if (audio) {
			audio.pause();
			setAudio(null);
		}
	}

	useEffect(() => {
		if (audio) {
			audio.play();
		}
	}, [audio])


	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{Object.keys(wordList).filter(w => wordList[w] !== null).map((d, i) => {
					const check = (letter.toLowerCase() === d[0].toLowerCase() && isNotNh(d)) || letter.toLowerCase() === d.substring(0, 2).toLowerCase();
					return check && wordList[d] && <li key={d + i}>
						<Link to={`/${i}/${d}`}>{d}</Link> - {wordList[d].definitions.map(d => d.definition).join('; ')}
						<div>
							{audioList[i] && (<>
							<button onClick={() => play(audioList[i].audio)}>Play</button>
							<button onClick={() => stop()}>Stop</button>
							<button onClick={() => moveAudio(i)}>Move</button>
							<button onClick={() => deleteAudio(i)}>Remove</button>
							<span> Audio Number: {audioList[i].number}</span>
							</>)}
						</div>
						</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;