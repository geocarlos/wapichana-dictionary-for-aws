import React, { useEffect, useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';

import wordList from '../data/entries.json';
import FileUpload from '../components/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../actions/EntryActions';
import IStore from '../store/IStore';
import User from '../model/User';
import WordEditor from './WordEditor';
const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/';

interface IProtectedRoute extends RouteProps {
	isLoggedIn: boolean;
	roles: Array<string>;
	userRoles: Array<string>
}

const ProtectedRoute = ({ isLoggedIn, roles, path, userRoles, children, ...rest }: IProtectedRoute) => {
	if (isLoggedIn && roles.some(role => userRoles.includes(role))) {
		return <Route {...rest}>{children}</Route>
	} else {
		return <Route path={path} render={() => (
			isLoggedIn ? <h1>YOU ARE NOT ALLOWED TO SEE THE PAGE!</h1> :
				<Redirect to="/" />
		)} {...rest} />
	}
}

const Main = () => {
	const [letter, setLetter] = useState('');
	const dispatch = useDispatch();
	const {isLoggedIn, userRoles} = useSelector<IStore, User>(state => state.user);

	useEffect(() => {
		if (letter) {
			dispatch(fetchEntries(letter));
		}
	}, [letter, dispatch]);

	return isLoggedIn === null ? isLoggedIn : (
		<AppContext.Provider value={{ wordList, audioUrl }}>
			<Router>
				<Header />
				<LetterNav setLetter={setLetter} />
				<Switch>
					<Route exact path="/">
						<WordList letter={letter} />
					</Route>
					<Route exact path="/fileupload">
						<FileUpload />
					</Route>
					<ProtectedRoute
						exact path='/editor'
						isLoggedIn={isLoggedIn}
						roles={['DictionaryEditor']}
						userRoles={userRoles || []}
					><WordEditor/></ProtectedRoute>
					<ProtectedRoute
						exact path='/editor/:entry_id'
						isLoggedIn={isLoggedIn}
						roles={['DictionaryEditor']}
						userRoles={userRoles || []}
					><WordEditor/></ProtectedRoute>
					<Route path="/:entry_id">
						<Word setLetter={setLetter} />
					</Route>
				</Switch>
			</Router>
		</AppContext.Provider>
	);
}

export default Main;