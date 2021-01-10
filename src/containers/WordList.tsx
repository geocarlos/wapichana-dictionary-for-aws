import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';
import PlayStop from '../components/PlayStop';

const isNotNh = (word: any) => {
	return word.substring(0,2).toLowerCase() !== 'nh'; 
}

const WordList = ({ letter = 'A'}) => {
	const { wordList, audioUrl } = useContext(AppContext);
	
	const [audio, setAudio] = useState<any>();

	const play = (url: string) => {
		console.log(url)
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

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{Object.keys(wordList).filter(w => wordList[w] !== null).map((d: any, i: number) => {
					const check = (letter.toLowerCase() === d[0].toLowerCase() && isNotNh(d)) || letter.toLowerCase() === d.substring(0, 2).toLowerCase();
					return check && wordList[d] && <li className="word-card" key={d + i}>
							<Link to={`/${i}/${d}`}>{d}</Link> - {wordList[d].definitions.map((d: any) => d.definition).join('; ')}
							<div>
								{wordList[d].audios.length > 0 && <span onClick={() => {
									audio && audio.src.includes(wordList[d].audios[0]) ? stop() : play(`${audioUrl + wordList[d].audios[0]}?alt=media`);
									}}>
									<PlayStop isPlaying={audio && audio.src.includes(wordList[d].audios[0])} />
								</span>}
							</div>
						</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;