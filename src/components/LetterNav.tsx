import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import User from '../model/User';
import IStore from '../store/IStore';
import Authenticator from './Authenticator';
import { Button } from '@material-ui/core';
import { signOut } from '../actions/UserActions';

type IProps = {
	setLetter: React.Dispatch<React.SetStateAction<string>>
}

const LetterNav = ({ setLetter }: IProps) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const user = useSelector<IStore, User | null>(state => state.user);
	const letters = ['A', 'B', 'D', 'G', 'I', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z', 'NH', 'CH'];

	useEffect(() => {
		if (location.pathname === '' || location.pathname === '/') {
			setLetter(prev => {
				return prev || 'A';
			});
		}
	}, [setLetter, location])

	return (
		<div className="search-container">
			<div className="search">
				<div>
					<ul className="alfabeto">
						{letters.slice(0, letters.indexOf('S')).map(letter => (
							<li key={letter} onClick={() => setLetter(letter)}><Link to='/'>{letter}</Link></li>
						))}
					</ul>
					<ul className="alfabeto">
						{letters.slice(letters.indexOf('S')).map(letter => (
							<li key={letter} onClick={() => setLetter(letter)}><Link to='/'>{letter}</Link></li>
						))}
					</ul>
				</div>
				<div className="authenticator-button">
					{user ?
						<><b>{user?.username}</b>
							<Button color="primary" onClick={() => {
								dispatch(signOut());
							}}>Sair</Button>
						</> :
						<Authenticator />
					}
				</div>
			</div>
		</div>
	);
}

export default LetterNav;