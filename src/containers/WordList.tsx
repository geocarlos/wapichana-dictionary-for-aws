import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';
import PlayStop from '../components/PlayStop';
import { useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';

export const isNotNh = (word: any) => {
	return word.substring(0, 2).toLowerCase() !== 'nh';
}

const WordList = ({ letter = 'A' }) => {
	const { audioUrl } = useContext(AppContext);
	const wordList = useSelector<IStore, Entry[]>(state => state.entries);

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
				{wordList.map((word: any, i: number) => (
					<li className="word-card" key={word.entry + i}>
						<Link to={`/${word.entry_id}`}>{word.entry}</Link> - {word.definition}
						<div>
							{word.audios.length > 0 && <span onClick={() => {
								audio && audio.src.includes(word.audios[0]) ? stop() : play(`${audioUrl + word.audios[0]}?alt=media`);
							}}>
								<PlayStop isPlaying={audio && audio.src.includes(word.audios[0])} />
							</span>}
						</div>
					</li>
				))}
			</ul>
		</section>
	)
}

export default WordList;