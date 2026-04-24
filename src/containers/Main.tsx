import React, { useEffect, useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../actions/EntryActions';
import IStore from '../store/IStore';
import User from '../model/User';
import WordEditor from './WordEditor';

interface IProtectedRoute {
	isLoggedIn: boolean | null;
	roles: Array<string>;
	userRoles: Array<string>;
	children: React.ReactNode;
}

const ProtectedRoute = ({ isLoggedIn, roles, userRoles, children }: IProtectedRoute) => {
	if (isLoggedIn && roles.some(role => userRoles.includes(role))) {
		return <>{children}</>;
	}
	return isLoggedIn ? <h1>VOCÊ NÃO TEM PERMISSÃO PARA VER ESTA PÁGINA!</h1> : <Navigate to="/" />;
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
			<Routes>
				<Route path="/" element={<WordList letter={letter} setLetter={setLetter} />} />
				<Route path="/fileupload" element={<FileUpload />} />
				<Route path="/editor" element={
					<ProtectedRoute
						isLoggedIn={isLoggedIn}
						roles={['DictionaryEditor']}
						userRoles={userRoles || []}
					><WordEditor setLetter={setLetter} /></ProtectedRoute>
				} />
				<Route path="/editor/:entry" element={
					<ProtectedRoute
						isLoggedIn={isLoggedIn}
						roles={['DictionaryEditor']}
						userRoles={userRoles || []}
					><WordEditor setLetter={setLetter} /></ProtectedRoute>
				} />
				<Route path="/:entry" element={<Word setLetter={setLetter} />} />
			</Routes>
		</Router>
	);
}

export default Main;