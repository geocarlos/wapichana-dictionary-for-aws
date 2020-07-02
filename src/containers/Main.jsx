import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';

import wordList from '../data/content.json';
import _audioList from '../data/audioList.json';

const Main = () => {
	const [letter, setLetter] = useState('A');
	const [audioList, setAudioList] = useState(_audioList.map(n => n ? {audio: `https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/audio_${n}.mp3?alt=media`, number: n} : n));

	const moveAudio = i => {
		const _list = audioList.slice(0);
		_list.splice(i,0,null);
		setAudioList(_list);
	}

	const deleteAudio = i => {
		const _list = audioList.slice(0);
		_list.splice(i,1);
		setAudioList(_list);
	}

	const save = () => {
		console.log(JSON.stringify(audioList.map(a => (a || {}).number || null), null, 2))
		fetch('http://localhost:3003/save', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(audioList.map(a => (a || {}).number || null), null, 2)
		})
	}
 
	return (
		<main>
			<Header />
			<AppContext.Provider value={{ wordList, audioList, moveAudio, deleteAudio }}>
				<button onClick={save}>Save</button>
				<Router>
					<LetterNav setLetter={setLetter} />
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route path="/:wordId/:word">
							<Word />
						</Route>
					</Switch>
				</Router>
			</AppContext.Provider>
		</main>
	)
}

export default Main;