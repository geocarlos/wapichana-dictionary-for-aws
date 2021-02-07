import React, { useEffect, useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../actions/EntryActions';
import IStore from '../store/IStore';
import User from '../model/User';
import WordEditor from './WordEditor';

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
	const { isLoggedIn, userRoles } = useSelector<IStore, User>(state => state.user);

	useEffect(() => {
		if (letter) {
			dispatch(fetchEntries(letter));
		}
	}, [letter, dispatch]);

	return isLoggedIn === null ? isLoggedIn : (
		<Router>
			<div className="header-and-nav">
				<Header />
				<LetterNav setLetter={setLetter} />
			</div>
			<Switch>
				<Route exact path="/">
					<WordList letter={letter} setLetter={setLetter} />
				</Route>
				<Route exact path="/fileupload">
					<FileUpload />
				</Route>
				<ProtectedRoute
					exact path='/editor'
					isLoggedIn={isLoggedIn}
					roles={['DictionaryEditor']}
					userRoles={userRoles || []}
				><WordEditor setLetter={setLetter} /></ProtectedRoute>
				<ProtectedRoute
					exact path='/editor/:entry'
					isLoggedIn={isLoggedIn}
					roles={['DictionaryEditor']}
					userRoles={userRoles || []}
				><WordEditor setLetter={setLetter} /></ProtectedRoute>
				<Route path="/:entry">
					<Word setLetter={setLetter} />
				</Route>
			</Switch>
		</Router>
	);
}

export default Main;