import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PlayStop from '../components/PlayStop';
import { useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { Button, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { MEDIA_URL } from '../api/constants';
import Search from '../components/Search';

export const isNotNh = (word: any) => {
	return word.substring(0, 2).toLowerCase() !== 'nh';
}

export const getInitialLetter = (entry: string) => {
    return isNotNh(entry) && entry[0].toLocaleLowerCase() !== 'c' ? entry[0].toUpperCase() : entry.toUpperCase().substring(0, 2);
}

const WordList = ({ letter = 'A', setLetter }: any) => {
	const wordList = useSelector<IStore, Array<Entry[]>>(state => state.entries);
	const isLoggedIn = useSelector<IStore, boolean | null>(state => state.user.isLoggedIn);
	const history = useHistory();

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
	}, [audio]);

	return (
		<section className="wapi">
			<div className="wapi-header">
				<h2 id={letter}>{letter}</h2>
				{isLoggedIn && 
				<Button onClick={() => history.push('/editor')} variant="outlined" color="primary" size="small">
					Adicionar Palavra
				</Button>}
			</div>
			<ul>
				<li className="search">
					<Search letter={letter} setLetter={setLetter} />			
				</li>
				{wordList.map((word: Array<any>, i: number) => (
					<li className="word-card" key={word[0].entry + i}>
						<Link to={`/${word[0].entry}`}>{word[0].entry}</Link> - {word.map(w => w.definition).join('; ')}
						{isLoggedIn && <IconButton style={{padding: 0}} onClick={() => history.push(`/editor/${word[0].entry}`)}><Edit /></IconButton>}
						<div>
							{word[0].audios.length > 0 && <span onClick={() => {
								audio && audio.src.includes(word[0].audios[0]) ? stop() : play(`${MEDIA_URL}/audio/${word[0].audios[0]}`);
							}}>
								<PlayStop isPlaying={audio && audio.src.includes(word[0].audios[0])} />
							</span>}
						</div>
					</li>
				))}
			</ul>
		</section>
	)
}

export default WordList;