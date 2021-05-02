import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IStore from '../store/IStore';
import Entry from '../model/Entry';
import { getInitialLetter } from './WordList';
import { Button, IconButton, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import { MEDIA_URL } from '../api/constants';
import { ArrowBack, Edit, Menu } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'grid',
		position: 'relative',
		height: '73vh',
		alignItems: 'flex-start',
		width: '100%',
		margin: '0',
		gridTemplateColumns: '20% auto',
		columnGap: '2rem',
		padding: '1rem',
		[theme.breakpoints.down(700)]: {
			height: '73vh',
			gridTemplateColumns: 'auto',
			gridTemplateRows: 'fit-content(100%)'
		}
	},
	item: {
		height: '100%',
		overflow: 'auto',
	},
	navigation: {
		position: 'sticky',
		display: 'flex',
		width: '100%',
		height: 'fit-content',
		color: 'white',
		top: 20,
		padding: 0,
		margin: 0,
		zIndex: 1,
		'& .icon-buttons': {
			display: 'flex',
			position: 'sticky',
			top: 0,
			width: '100%',
			justifyContent: 'space-between'
		}
	},
	navList: {
		width: '100%',
		padding: '1rem',
		height: '90%',
		'& a': {
			color: 'var(--primary-color)'
		},
		'& .nav-list-item': {
			padding: '.5rem 0'
		},
		[theme.breakpoints.down(700)]: {
			position: 'absolute',
			height: 'fit-content',
			maxHeight: '65vh',
			top: '100%',
			overflowY: 'auto',
			transition: 'left 500ms linear',
			background: '#efefef',
			animation: '$appear 1s'
		}
	},
	wordView: {
		display: 'grid',
		gridTemplateColumns: '50% 50%',
		width: '100%',
		height: 'fit-content',
		overflow: 'auto',
		[theme.breakpoints.down(700)]: {
			gridTemplateColumns: 'auto'
		}
	},
	returnButton: {
		position: 'sticky',
		top: 0,
		zIndex: 100
	},
	definition: {
		fontSize: '1.5rem',
		padding: '.5rem 0',
		'& em': {
			marginRight: '.5rem',
			fontWeight: 600
		}
	},
	examples: {
		margin: '.5rem 0',
		padding: '1rem 0',
		'& .examples-header': {
			fontWeight: 600,
			fontSize: '1.5rem'
		},
		'& .example-block': {
			background: '#efefef',
			borderRadius: '.5rem',
			padding: '1rem',
			margin: '.5rem 0'
		}
	},
	media: {
		padding: '1rem 2rem',
		'& img': {
			width: '15rem'
		}
	},
	'@keyframes appear': {
		from: {
			width: '0%'
		},
		to: {
			width: '100%'
		}
	}
}));

type IProps = {
	setLetter: React.Dispatch<React.SetStateAction<string>>
}

const Word = ({ setLetter }: IProps) => {
	const classes = useStyles();
	const history = useHistory();

	const { entry }: any = useParams();

	const wordList = useSelector<IStore, Array<Entry[]>>(state => state.entries);
	const isLoggedIn = useSelector<IStore, boolean | null>(state => state.user.isLoggedIn);
	const [word, setWord] = React.useState<Entry[] | null>(null);
	const isLargeScreen = useMediaQuery('(min-width:700px)');

	const [showNavList, setShowNavList] = useState(false);

	useEffect(() => {
		if (wordList && wordList.length) {
			const _word = wordList.filter(word => entry === word[0].entry);
			if (_word[0]) {
				setWord(_word[0]);
			}
		}
		setLetter(prev => {
			return entry ? getInitialLetter(entry) : prev;
		})
	}, [wordList, entry, setLetter])

	return word ? (
		<div className={classes.root}>
			<div className={isLargeScreen ? classes.item : classes.navigation}>
				{isLargeScreen ?
					<Button className={classes.returnButton} variant="contained" color="secondary"
						onClick={() => history.push('/')}>Voltar</Button> :
					<div className="icon-buttons"><IconButton onClick={() => history.push('/')}><ArrowBack /></IconButton>
						<IconButton onClick={() => setShowNavList(prev => !prev)}><Menu /></IconButton></div>}
				{(isLargeScreen || showNavList) &&
					<Paper elevation={0} className={classes.navList}>
						{wordList.map(w => (
							<div key={w[0].entry} className="nav-list-item">
								<Link onClick={() => isLargeScreen ? null : setShowNavList(false)} to={`/${w[0].entry}`}>{w[0].entry}</Link>
							</div>
						))}
					</Paper>}
			</div>
			<div className={classes.item}>
				<h1>
					{word[0].entry}
					{isLoggedIn &&
						<IconButton style={{ padding: 0 }} onClick={() => history.push(`/editor/${word[0].entry}`)}><Edit /></IconButton>}
				</h1>
				{word && word.map((w: Entry, index: number) => (
					<div key={w.entry_id} className={classes.wordView}>
						<div>
							<div className={classes.definition}>
								<b>{index + 1}. </b><em>{w.gramm}</em>
								{w.definition}
							</div>
							{w.examples.length > 0 && 
							<div className={classes.examples}>
								<div className="examples-header">
									{`Exemplo${w.examples.length > 1 ? 's' : ''}`}
								</div>
								{w.examples.map((e: any) => (
									<div className="example-block" key={e.example}>
										<p><b>{e.example}</b></p>
										<p>{e.exampleTranslation}</p>
									</div>
								))}
							</div>}
						</div>
						<div className={classes.media}>
							{w.images?.map((img: any) => (
								<img key={img} src={`${MEDIA_URL}/image/${img}`} alt={img} />
							))}
							{w.audios.map(audio => (
								<audio key={audio} controls>
									<source src={`${MEDIA_URL}/audio/${audio}`} />
								</audio>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	) : null;
}

export default Word;