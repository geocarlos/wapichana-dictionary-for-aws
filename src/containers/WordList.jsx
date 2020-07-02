import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';
import PlayStop from '../components/PlayStop';

const isNotNh = word => {
	return word.substring(0,2).toLowerCase() !== 'nh'; 
}

const WordList = ({ letter = 'A'}) => {
	const { wordList, audioList } = useContext(AppContext);
	
	const [audio, setAudio] = useState();

	const play = url => {
		if (audio) {
			audio.pause();
		}
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
			audio.onended = stop;
			audio.play();
		}
	}, [audio])

	if (audio) {
		console.log(audio.currentTime);
		console.log(audio.duration);
	}

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{Object.keys(wordList).filter(w => wordList[w] !== null).map((d, i) => {
					const check = (letter.toLowerCase() === d[0].toLowerCase() && isNotNh(d)) || letter.toLowerCase() === d.substring(0, 2).toLowerCase();
					return check && wordList[d] && <li className="word-card" key={d + i}>
							<Link to={`/${i}/${d}`}>{d}</Link> - {wordList[d].definitions.map(d => d.definition).join('; ')}
							<div>
								{audioList[i] && <span onClick={() => {
									audio && audio.src === audioList[i].audio ? stop() : play(audioList[i].audio);
									}}>
									<PlayStop isPlaying={audio && audio.src === audioList[i].audio} />
								</span>}
							</div>
						</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;