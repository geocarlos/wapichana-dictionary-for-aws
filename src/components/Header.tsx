import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const logoStyle = {
	display: 'flex',
	alignItems: 'center',
	height: '9rem',
	width: '85%',
	margin: 'auto',
	transition: 'height 250ms linear',
	'& figure': {
		width: '12.5rem',
		height: '5.5rem',
		margin: '.5rem 2rem 1rem 0',
		backgroundColor: 'white'
	},			
	'& h1': {
		fontSize: '3rem',
		padding: 0,
		color: 'white'
	}
}

const useStyles = makeStyles({
	header: {
		width: '100%',
		height: '23%',
		background: '#8B131D',
		'& .logo': logoStyle,
		zIndex: 1
	},
	headerSmall: {
		width: '100%',
		height: '5%',
		top: 0,
		zIndex: 1,
		background: '#8B131D',
		'& .logo': {
			...logoStyle,
			height: '3rem',
			'& figure': {
				...logoStyle['& figure'],
				height: '1.5rem',
				width: '2rem',
				'& img': {
					width: '100%',
					height: '100%'
				}
			},
			'& h1': {
				...logoStyle['& h1'],
				fontSize: '1rem'
			}		
		}
	}
});

const Header = () => {
	const classes = useStyles();
	const location = useLocation();

	const [headerClass, setHeaderClass] = React.useState(classes.header);

	useEffect(() => {
		if (location.pathname === '/' || location.pathname === '') {
			setHeaderClass(classes.header)
			const scrollListener = () => {
				if (window.scrollY > 1) {
					setHeaderClass(prev => {
						return prev === classes.header ? classes.headerSmall : prev;
					});
				} else if (window.scrollY === 0 && window.document.getElementById('root')?.clientHeight! > window.innerHeight) {
					setHeaderClass(prev => {
						return prev === classes.headerSmall ? classes.header : prev;
					});
				}
			}
	
			window.addEventListener('scroll', scrollListener)
	
			return () => window.removeEventListener('scroll', scrollListener);
		} else {
			setHeaderClass(classes.headerSmall);
		}
	}, [location, classes, setHeaderClass]);

	return (
		<header className={headerClass}>
			<div className="logo">
				<figure>
					<img width="200" height="100" src={logo} alt="" />
				</figure>
				<h1>Dicionario Wapichana</h1>
			</div>
		</header>
	);
}

export default Header;